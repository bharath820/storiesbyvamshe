import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "./firebaseClient";

const ADMIN_SESSION_KEY = "storiesbyvamshe.admin.session.v1";
const AUTH_CHANGED_EVENT = "storiesbyvamshe:auth-changed";
export const DUMMY_ADMIN_EMAIL = "admin@stories.local";
export const DUMMY_ADMIN_PASSWORD = "Admin@12345";

function localSession() {
  try {
    const value = JSON.parse(window.localStorage.getItem(ADMIN_SESSION_KEY));
    return value?.isAdmin ? value : null;
  } catch {
    return null;
  }
}

export function getAdminSession() {
  if (isFirebaseConfigured) return firebaseAuth.currentUser;
  return typeof window === "undefined" ? null : localSession();
}

export function subscribeToAuthChanges(callback) {
  if (isFirebaseConfigured) return onAuthStateChanged(firebaseAuth, callback);
  if (typeof window === "undefined") return () => {};
  const sync = () => callback(localSession());
  window.addEventListener(AUTH_CHANGED_EVENT, sync);
  window.addEventListener("storage", sync);
  Promise.resolve().then(sync);
  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, sync);
    window.removeEventListener("storage", sync);
  };
}

export async function loginAdmin(email, password) {
  if (isFirebaseConfigured) return (await signInWithEmailAndPassword(firebaseAuth, email.trim(), password)).user;
  if (email.trim().toLowerCase() !== DUMMY_ADMIN_EMAIL || password !== DUMMY_ADMIN_PASSWORD) {
    throw new Error("Invalid admin credentials.");
  }
  const session = { isAdmin: true, email: DUMMY_ADMIN_EMAIL, loggedInAt: new Date().toISOString() };
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new window.CustomEvent(AUTH_CHANGED_EVENT));
  return session;
}

export async function logoutAdmin() {
  if (isFirebaseConfigured) return signOut(firebaseAuth);
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new window.CustomEvent(AUTH_CHANGED_EVENT));
}
