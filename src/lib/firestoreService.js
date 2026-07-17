import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";
import { toDateValue } from "../utils/format";
import { demoHomepageConfig } from "../data/demoContent";
import { firestoreDb, isFirebaseConfigured } from "./firebaseClient";
import { readContentState, subscribeToContentChanges, updateContentState } from "./localDataStore";

const COLLECTIONS = new Set(["categories", "photos", "videos", "blogs"]);

function ensureCollectionName(name) {
  if (!COLLECTIONS.has(name)) throw new Error(`Unknown collection: ${name}`);
}

function clone(value) {
  return typeof globalThis.structuredClone === "function"
    ? globalThis.structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function toIso(value) {
  if (!value) return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  return value;
}

function normalizeDocument(snapshot) {
  const value = snapshot.data();
  return {
    id: snapshot.id,
    ...value,
    createdAt: toIso(value.createdAt),
    updatedAt: toIso(value.updatedAt),
    publishedAt: toIso(value.publishedAt)
  };
}

function sortByLatest(items) {
  return [...items].sort((a, b) => {
    const ad = toDateValue(a.createdAt) || new Date(0);
    const bd = toDateValue(b.createdAt) || new Date(0);
    return bd - ad;
  });
}

function sortPhotosForGallery(items) {
  return sortByLatest(items);
}

function localCreateId(name) {
  return `${name}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function listCollection(name) {
  ensureCollectionName(name);
  if (!isFirebaseConfigured) return clone(readContentState().collections[name] || []);
  const snapshot = await getDocs(collection(firestoreDb, name));
  return snapshot.docs.map(normalizeDocument);
}

export async function createDocument(name, payload) {
  ensureCollectionName(name);
  if (isFirebaseConfigured) {
    const result = await addDoc(collection(firestoreDb, name), {
      ...payload,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: result.id };
  }

  const id = localCreateId(name);
  const now = new Date().toISOString();
  updateContentState((state) => {
    state.collections[name] = [...(state.collections[name] || []), { id, ...payload, createdAt: now, updatedAt: now }];
    return state;
  }, { action: "create", collection: name, id });
  return { id };
}

export async function updateDocument(name, id, payload) {
  ensureCollectionName(name);
  if (isFirebaseConfigured) {
    await updateDoc(doc(firestoreDb, name, id), { ...payload, updatedAt: serverTimestamp() });
    return;
  }
  const now = new Date().toISOString();
  updateContentState((state) => {
    state.collections[name] = (state.collections[name] || []).map((row) =>
      row.id === id ? { ...row, ...payload, updatedAt: now } : row
    );
    return state;
  }, { action: "update", collection: name, id });
}

export async function removeDocument(name, id) {
  ensureCollectionName(name);
  if (isFirebaseConfigured) {
    await deleteDoc(doc(firestoreDb, name, id));
    return;
  }
  updateContentState((state) => {
    state.collections[name] = (state.collections[name] || []).filter((row) => row.id !== id);
    return state;
  }, { action: "delete", collection: name, id });
}

export async function getHomepageConfig() {
  if (!isFirebaseConfigured) return clone(readContentState().homepageConfig || demoHomepageConfig);
  const snapshot = await getDoc(doc(firestoreDb, "siteConfig", "homepage"));
  return snapshot.exists() ? { ...demoHomepageConfig, ...snapshot.data() } : clone(demoHomepageConfig);
}

export async function saveHomepageConfig(payload) {
  if (isFirebaseConfigured) {
    await setDoc(doc(firestoreDb, "siteConfig", "homepage"), { ...payload, updatedAt: serverTimestamp() }, { merge: true });
    return;
  }
  updateContentState((state) => {
    state.homepageConfig = { ...(state.homepageConfig || {}), ...clone(payload), updatedAt: new Date().toISOString() };
    return state;
  }, { action: "save-homepage" });
}

async function getPublished(name) {
  if (!isFirebaseConfigured) {
    const rows = await listCollection(name);
    return rows.filter((item) => (item.status || "draft") === "published");
  }
  const snapshot = await getDocs(query(collection(firestoreDb, name), where("status", "==", "published")));
  return snapshot.docs.map(normalizeDocument);
}

export async function getPublishedCategories() {
  if (!isFirebaseConfigured) {
    const rows = await listCollection("categories");
    return rows.filter((item) => item.isActive !== false);
  }
  const snapshot = await getDocs(query(collection(firestoreDb, "categories"), where("isActive", "==", true)));
  return snapshot.docs.map(normalizeDocument);
}

export async function getPublishedPhotos() {
  return sortPhotosForGallery(await getPublished("photos"));
}

export async function getPublishedVideos() {
  return sortByLatest(await getPublished("videos"));
}

export async function getPublishedBlogs() {
  return sortByLatest(await getPublished("blogs"));
}

function subscribeLocal(loader, callback, onError) {
  let active = true;
  const run = () => loader().then((rows) => active && callback(rows)).catch(onError);
  run();
  const unsubscribe = subscribeToContentChanges(run);
  return () => {
    active = false;
    unsubscribe();
  };
}

export function subscribeCollection(name, callback, onError = () => {}) {
  ensureCollectionName(name);
  if (!isFirebaseConfigured) return subscribeLocal(() => listCollection(name), callback, onError);
  return onSnapshot(collection(firestoreDb, name), (snapshot) => callback(snapshot.docs.map(normalizeDocument)), onError);
}

export function subscribePublishedCollection(name, callback, onError = () => {}) {
  ensureCollectionName(name);
  if (!isFirebaseConfigured) return subscribeLocal(() => getPublished(name), callback, onError);
  const publishedQuery = query(collection(firestoreDb, name), where("status", "==", "published"));
  return onSnapshot(publishedQuery, (snapshot) => callback(snapshot.docs.map(normalizeDocument)), onError);
}

export function subscribePublishedCategories(callback, onError = () => {}) {
  if (!isFirebaseConfigured) return subscribeLocal(getPublishedCategories, callback, onError);
  const categoriesQuery = query(collection(firestoreDb, "categories"), where("isActive", "==", true));
  return onSnapshot(categoriesQuery, (snapshot) => callback(snapshot.docs.map(normalizeDocument)), onError);
}

export function subscribeHomepageConfig(callback, onError = () => {}) {
  if (!isFirebaseConfigured) return subscribeLocal(getHomepageConfig, callback, onError);
  return onSnapshot(doc(firestoreDb, "siteConfig", "homepage"), (snapshot) => {
    callback(snapshot.exists() ? { ...demoHomepageConfig, ...snapshot.data() } : clone(demoHomepageConfig));
  }, onError);
}
