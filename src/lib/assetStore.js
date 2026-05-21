const ASSET_DB_NAME = "storiesbyvamshe.assets.v1";
const ASSET_DB_VERSION = 1;
const ASSET_STORE_NAME = "assets";
const ASSET_REF_PREFIX = "asset://";

function canUseIndexedDb() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function createAssetId() {
  return `asset-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function toAssetRef(id) {
  return `${ASSET_REF_PREFIX}${id}`;
}

export function isAssetRef(value) {
  return typeof value === "string" && value.startsWith(ASSET_REF_PREFIX);
}

export function getAssetIdFromRef(value) {
  if (!isAssetRef(value)) return "";
  return value.slice(ASSET_REF_PREFIX.length).trim();
}

function openDb() {
  return new Promise((resolve, reject) => {
    if (!canUseIndexedDb()) {
      reject(new Error("IndexedDB is not available in this browser."));
      return;
    }

    const request = window.indexedDB.open(ASSET_DB_NAME, ASSET_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(ASSET_STORE_NAME)) {
        db.createObjectStore(ASSET_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Could not open asset database."));
  });
}

async function withStore(mode, operation) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(ASSET_STORE_NAME, mode);
    const store = tx.objectStore(ASSET_STORE_NAME);

    let result;
    try {
      result = operation(store, tx);
    } catch (error) {
      db.close();
      reject(error);
      return;
    }

    tx.oncomplete = () => {
      db.close();
      resolve(result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error("Asset database transaction failed."));
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error || new Error("Asset database transaction aborted."));
    };
  });
}

export async function saveImageFile(file, folder = "uploads") {
  const id = createAssetId();
  const record = {
    id,
    folder,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: Number(file.size) || 0,
    createdAt: new Date().toISOString(),
    blob: file
  };

  try {
    await withStore("readwrite", (store) => {
      store.put(record);
    });
  } catch (error) {
    if (error?.name === "QuotaExceededError") {
      throw new Error("Storage limit reached. Remove some older uploads and try again.");
    }
    throw new Error("Could not save image in browser storage.");
  }

  return toAssetRef(id);
}

export async function getImageBlob(assetId) {
  if (!assetId) return null;

  return withStore("readonly", (store) => {
    const request = store.get(assetId);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result?.blob || null);
      request.onerror = () => reject(request.error || new Error("Could not read stored image."));
    });
  });
}

export async function deleteImage(assetId) {
  if (!assetId) return;
  await withStore("readwrite", (store) => {
    store.delete(assetId);
  });
}

export async function listAssetsByUsage(folder = "") {
  const rows = await withStore("readonly", (store) => {
    const request = store.getAll();
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error || new Error("Could not list stored images."));
    });
  });

  if (!folder) return rows;
  return rows.filter((row) => row.folder === folder);
}
