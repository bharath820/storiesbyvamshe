import { saveImageFile } from "./assetStore";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

export async function uploadAsset(file, folder = "uploads") {
  if (!file) return "";
  if (!file.type?.startsWith("image/")) {
    throw new Error("Only image uploads are supported right now.");
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`Image is too large. Please use a file under ${MAX_IMAGE_SIZE_MB}MB.`);
  }

  return saveImageFile(file, folder);
}
