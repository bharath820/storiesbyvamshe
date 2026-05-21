import { toDateValue } from "../utils/format";
import { readContentState, updateContentState } from "./localDataStore";

const COLLECTIONS = new Set(["categories", "photos", "videos", "blogs"]);

function clone(value) {
  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
}

function ensureCollectionName(name) {
  if (!COLLECTIONS.has(name)) {
    throw new Error(`Unknown collection: ${name}`);
  }
}

function sortByLatest(items) {
  return [...items].sort((a, b) => {
    const ad = toDateValue(a.createdAt) || new Date(0);
    const bd = toDateValue(b.createdAt) || new Date(0);
    return bd - ad;
  });
}

function sortPhotosForGallery(items) {
  return [...items].sort((a, b) => {
    const aFeatured = Boolean(a.featured);
    const bFeatured = Boolean(b.featured);
    if (aFeatured !== bFeatured) {
      return aFeatured ? -1 : 1;
    }

    const ad = toDateValue(a.createdAt) || new Date(0);
    const bd = toDateValue(b.createdAt) || new Date(0);
    return bd - ad;
  });
}

function createId(name) {
  const suffix = Math.random().toString(36).slice(2, 10);
  return `${name}-${Date.now()}-${suffix}`;
}

function isoNow() {
  return new Date().toISOString();
}

export async function listCollection(name) {
  ensureCollectionName(name);
  const state = readContentState();
  return clone(state.collections[name] || []);
}

export async function createDocument(name, payload) {
  ensureCollectionName(name);
  const now = isoNow();
  const id = createId(name);

  updateContentState(
    (state) => {
      const next = { ...state };
      next.collections[name] = [...(state.collections[name] || []), { id, ...payload, createdAt: now, updatedAt: now }];
      return next;
    },
    { action: "create", collection: name, id }
  );

  return { id };
}

export async function updateDocument(name, id, payload) {
  ensureCollectionName(name);
  const now = isoNow();

  updateContentState(
    (state) => {
      const next = { ...state };
      const rows = state.collections[name] || [];
      next.collections[name] = rows.map((row) => (row.id === id ? { ...row, ...payload, updatedAt: now } : row));
      return next;
    },
    { action: "update", collection: name, id }
  );
}

export async function removeDocument(name, id) {
  ensureCollectionName(name);

  updateContentState(
    (state) => {
      const next = { ...state };
      next.collections[name] = (state.collections[name] || []).filter((row) => row.id !== id);
      return next;
    },
    { action: "delete", collection: name, id }
  );
}

export async function getHomepageConfig() {
  const state = readContentState();
  return clone(state.homepageConfig || {});
}

export async function saveHomepageConfig(payload) {
  updateContentState(
    (state) => {
      const next = { ...state };
      next.homepageConfig = {
        ...(state.homepageConfig || {}),
        ...clone(payload),
        updatedAt: isoNow()
      };
      return next;
    },
    { action: "save-homepage" }
  );
}

export async function getPublishedCategories() {
  const categories = await listCollection("categories");
  return categories.filter((item) => item.isActive !== false);
}

export async function getPublishedPhotos() {
  const photos = await listCollection("photos");
  return sortPhotosForGallery(photos.filter((photo) => (photo.status || "draft") === "published"));
}

export async function getPublishedVideos() {
  const videos = await listCollection("videos");
  return sortByLatest(videos.filter((video) => (video.status || "draft") === "published"));
}

export async function getPublishedBlogs() {
  const blogs = await listCollection("blogs");
  return sortByLatest(blogs.filter((blog) => (blog.status || "draft") === "published"));
}
