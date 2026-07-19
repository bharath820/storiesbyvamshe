import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { deleteImage, getAssetIdFromRef, isAssetRef, saveImageFile } from "./assetStore";
import { firebaseStorage, isFirebaseConfigured } from "./firebaseClient";

export const MAX_IMAGE_SIZE_MB = 40;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const OPTIMIZED_IMAGE_MAX_EDGE_PX = 2400;
const OPTIMIZED_IMAGE_QUALITY = 0.82;
const MIN_IMAGE_OPTIMIZE_BYTES = 900 * 1024;
const OPTIMIZABLE_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateImageFile(file) {
  if (!file) throw new Error("Choose an image to upload.");
  if (!file.type?.startsWith("image/")) throw new Error(`${file.name || "File"} is not an image.`);
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`${file.name || "Image"} is larger than ${MAX_IMAGE_SIZE_MB}MB.`);
  }
}

function safeFileName(name = "image") {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "image";
}

function canOptimizeImages() {
  return typeof window !== "undefined" && typeof document !== "undefined" && typeof document.createElement === "function";
}

function getScaledSize(width, height) {
  const longestSide = Math.max(width, height);
  if (!longestSide || longestSide <= OPTIMIZED_IMAGE_MAX_EDGE_PX) {
    return { width, height, resized: false };
  }

  const scale = OPTIMIZED_IMAGE_MAX_EDGE_PX / longestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
    resized: true
  };
}

function outputFileName(name = "image", mimeType = "image/webp") {
  const extension = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1] || "webp";
  const baseName = name.replace(/\.[^.]+$/, "") || "image";
  return `${baseName}.${extension}`;
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, quality);
  });
}

function loadImageSource(file) {
  if (typeof window.createImageBitmap === "function") {
    return window.createImageBitmap(file, { imageOrientation: "from-image" }).then((bitmap) => ({
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      cleanup: () => bitmap.close?.()
    }));
  }

  return new Promise((resolve, reject) => {
    const image = new window.Image();
    const imageUrl = URL.createObjectURL(file);
    image.onload = () => {
      URL.revokeObjectURL(imageUrl);
      resolve({
        source: image,
        width: image.naturalWidth || image.width,
        height: image.naturalHeight || image.height,
        cleanup: () => {}
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Could not read image for optimization."));
    };
    image.src = imageUrl;
  });
}

async function optimizeImageFile(file) {
  if (!canOptimizeImages() || !OPTIMIZABLE_IMAGE_TYPES.has(file.type)) return file;

  let image;
  try {
    image = await loadImageSource(file);
    const target = getScaledSize(image.width, image.height);
    if (!target.resized && file.size < MIN_IMAGE_OPTIMIZE_BYTES) return file;

    const canvas = document.createElement("canvas");
    canvas.width = target.width;
    canvas.height = target.height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return file;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image.source, 0, 0, target.width, target.height);

    const outputTypes = file.type === "image/png" ? ["image/webp", "image/png"] : ["image/webp", "image/jpeg"];
    for (const outputType of outputTypes) {
      const blob = await canvasToBlob(canvas, outputType, OPTIMIZED_IMAGE_QUALITY);
      if (blob?.size && blob.size < file.size * 0.95) {
        return new File([blob], outputFileName(file.name, blob.type || outputType), {
          type: blob.type || outputType,
          lastModified: file.lastModified
        });
      }
    }
  } catch {
    return file;
  } finally {
    image?.cleanup();
  }

  return file;
}

export async function uploadAsset(file, folder = "uploads", onProgress = () => {}) {
  validateImageFile(file);
  const uploadFile = await optimizeImageFile(file);
  if (!isFirebaseConfigured) {
    const imageUrl = await saveImageFile(uploadFile, folder);
    onProgress(100);
    return { imageUrl, storagePath: imageUrl };
  }

  const storagePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileName(uploadFile.name)}`;
  const storageRef = ref(firebaseStorage, storagePath);
  const task = uploadBytesResumable(storageRef, uploadFile, { contentType: uploadFile.type || file.type });
  await new Promise((resolve, reject) => {
    task.on("state_changed", (snapshot) => {
      onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
    }, reject, resolve);
  });
  return { imageUrl: await getDownloadURL(storageRef), storagePath };
}

export async function deleteStoredAsset(storagePath) {
  if (!storagePath) return;
  if (!isFirebaseConfigured || isAssetRef(storagePath)) {
    const id = getAssetIdFromRef(storagePath);
    if (id) await deleteImage(id);
    return;
  }
  await deleteObject(ref(firebaseStorage, storagePath));
}
