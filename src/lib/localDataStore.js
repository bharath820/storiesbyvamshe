import {
  demoBlogs,
  demoCategories,
  demoHomepageConfig,
  demoPhotos,
  demoVideos
} from "../data/demoContent";

const STORE_KEY = "storiesbyvamshe.static.store.v1";
const STORE_VERSION = 1;
export const CONTENT_CHANGED_EVENT = "storiesbyvamshe:content-changed";

let memoryState = createInitialState();

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function clone(value) {
  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function nowIso() {
  return new Date().toISOString();
}

function createInitialState() {
  const now = nowIso();
  return {
    version: STORE_VERSION,
    collections: {
      categories: clone(demoCategories).map((row) => ({
        ...row,
        createdAt: row.createdAt || now,
        updatedAt: row.updatedAt || now
      })),
      photos: clone(demoPhotos).map((row) => ({
        ...row,
        createdAt: row.createdAt || now,
        updatedAt: row.updatedAt || now
      })),
      videos: clone(demoVideos).map((row) => ({
        ...row,
        createdAt: row.createdAt || now,
        updatedAt: row.updatedAt || now
      })),
      blogs: clone(demoBlogs).map((row) => ({
        ...row,
        createdAt: row.createdAt || now,
        updatedAt: row.updatedAt || now
      }))
    },
    homepageConfig: clone(demoHomepageConfig),
    lastUpdatedAt: now
  };
}

function isPlainObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function normalizeState(value) {
  if (!isPlainObject(value)) return createInitialState();
  if (!isPlainObject(value.collections)) return createInitialState();
  if (value.version !== STORE_VERSION) return createInitialState();

  const safeState = createInitialState();
  const collections = value.collections;

  ["categories", "photos", "videos", "blogs"].forEach((name) => {
    if (Array.isArray(collections[name])) {
      safeState.collections[name] = collections[name]
        .filter((row) => isPlainObject(row) && typeof row.id === "string" && row.id.trim())
        .map((row) => ({ ...row }));
    }
  });

  // Keep existing browser-local demo sites in sync when new starter blogs are added.
  if (safeState.collections.blogs.some((blog) => blog.id === "blog-1")) {
    const existingBlogIds = new Set(safeState.collections.blogs.map((blog) => blog.id));
    safeState.collections.blogs.push(
      ...clone(demoBlogs).filter((blog) => !existingBlogIds.has(blog.id))
    );
  }

  if (isPlainObject(value.homepageConfig)) {
    safeState.homepageConfig = clone(value.homepageConfig);
  }

  safeState.lastUpdatedAt = typeof value.lastUpdatedAt === "string" ? value.lastUpdatedAt : nowIso();
  return safeState;
}

function saveToStorage(state) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function loadFromStorage() {
  if (!canUseStorage()) return createInitialState();
  const raw = window.localStorage.getItem(STORE_KEY);
  if (!raw) {
    const initial = createInitialState();
    saveToStorage(initial);
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    const normalized = normalizeState(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      saveToStorage(normalized);
    }
    return normalized;
  } catch {
    const initial = createInitialState();
    saveToStorage(initial);
    return initial;
  }
}

function emitContentChanged(meta = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new window.CustomEvent(CONTENT_CHANGED_EVENT, {
      detail: { ...meta, at: nowIso() }
    })
  );
}

export function readContentState() {
  if (canUseStorage()) {
    return clone(loadFromStorage());
  }
  return clone(memoryState);
}

export function writeContentState(nextState, meta = {}) {
  const normalized = normalizeState(nextState);
  normalized.lastUpdatedAt = nowIso();
  memoryState = normalized;
  if (canUseStorage()) {
    saveToStorage(normalized);
  }
  emitContentChanged(meta);
  return clone(normalized);
}

export function updateContentState(updater, meta = {}) {
  const current = readContentState();
  const next = updater(current);
  return writeContentState(next, meta);
}

export function subscribeToContentChanges(callback) {
  if (typeof window === "undefined") return () => {};

  const onCustom = () => callback();
  const onStorage = (event) => {
    if (event.key === STORE_KEY) callback();
  };

  window.addEventListener(CONTENT_CHANGED_EVENT, onCustom);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(CONTENT_CHANGED_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
