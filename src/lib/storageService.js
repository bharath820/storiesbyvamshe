import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { deleteImage, getAssetIdFromRef, isAssetRef, saveImageFile } from "./assetStore";
import { firebaseStorage, isFirebaseConfigured } from "./firebaseClient";

export const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

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

export async function uploadAsset(file, folder = "uploads", onProgress = () => {}) {
  validateImageFile(file);
  if (!isFirebaseConfigured) {
    const imageUrl = await saveImageFile(file, folder);
    onProgress(100);
    return { imageUrl, storagePath: imageUrl };
  }

  const storagePath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFileName(file.name)}`;
  const storageRef = ref(firebaseStorage, storagePath);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
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
