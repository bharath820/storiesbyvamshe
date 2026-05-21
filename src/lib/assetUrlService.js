import { getAssetIdFromRef, getImageBlob, isAssetRef } from "./assetStore";

export async function resolveAssetUrl(imageRef) {
  if (!imageRef || typeof imageRef !== "string") return "";
  if (!isAssetRef(imageRef)) return imageRef;

  const assetId = getAssetIdFromRef(imageRef);
  if (!assetId) return "";

  const blob = await getImageBlob(assetId);
  if (!blob) return "";
  return window.URL.createObjectURL(blob);
}

