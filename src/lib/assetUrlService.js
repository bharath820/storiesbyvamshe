import { getAssetIdFromRef, getImageBlob, isAssetRef } from "./assetStore";

// Keep browser object URLs for the lifetime of the session so navigating
// between pages does not re-read the same uploaded image from IndexedDB.
const resolvedAssetUrls = new Map();

export async function resolveAssetUrl(imageRef) {
  if (!imageRef || typeof imageRef !== "string") return "";
  if (!isAssetRef(imageRef)) return imageRef;

  if (resolvedAssetUrls.has(imageRef)) {
    return resolvedAssetUrls.get(imageRef);
  }

  const assetId = getAssetIdFromRef(imageRef);
  if (!assetId) return "";

  const resolvePromise = getImageBlob(assetId).then((blob) => (
    blob ? window.URL.createObjectURL(blob) : ""
  ));
  resolvedAssetUrls.set(imageRef, resolvePromise);

  try {
    return await resolvePromise;
  } catch (error) {
    resolvedAssetUrls.delete(imageRef);
    throw error;
  }
}

