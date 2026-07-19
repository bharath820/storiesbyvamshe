import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { firebaseAuth, isFirebaseConfigured } from "./firebaseClient";

const ADMIN_SESSION_KEY = "storiesbyvamshe.admin.session.v1";
const AUTH_CHANGED_EVENT = "storiesbyvamshe:auth-changed";
export const ADMIN_EMAIL = "storiesbyvamshe9@gmail.com";
export const ADMIN_PASSWORD = "--N@veen5555";

function isAdminEmail(email) {
  return String(email || "").trim().toLowerCase() === ADMIN_EMAIL;
}

function isAdminUser(user) {
  return isAdminEmail(user?.email);
}

function validateAdminCredentials(email, password) {
  if (!isAdminEmail(email) || password !== ADMIN_PASSWORD) {
    throw new Error("Invalid admin credentials.");
  }
}

function localSession() {
  try {
    const value = JSON.parse(window.localStorage.getItem(ADMIN_SESSION_KEY));
    return value?.isAdmin ? value : null;
  } catch {
    return null;
  }
}

export function getAdminSession() {
  if (isFirebaseConfigured) {
    return isAdminUser(firebaseAuth.currentUser) ? firebaseAuth.currentUser : null;
  }
  return typeof window === "undefined" ? null : localSession();
}

export function subscribeToAuthChanges(callback) {
  if (isFirebaseConfigured) {
    return onAuthStateChanged(firebaseAuth, (user) => callback(isAdminUser(user) ? user : null));
  }
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
  validateAdminCredentials(email, password);

  if (isFirebaseConfigured) {
    try {
      const result = await signInWithEmailAndPassword(firebaseAuth, ADMIN_EMAIL, ADMIN_PASSWORD);
      return result.user;
    } catch (error) {
      if (["auth/invalid-credential", "auth/user-not-found", "auth/wrong-password"].includes(error?.code)) {
        throw new Error("Create this admin account in Firebase Authentication with the same password.");
      }
      throw error;
    }
  }

  const session = { isAdmin: true, email: ADMIN_EMAIL, loggedInAt: new Date().toISOString() };
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new window.CustomEvent(AUTH_CHANGED_EVENT));
  return session;
}

export async function logoutAdmin() {
  if (isFirebaseConfigured) return signOut(firebaseAuth);
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
  window.dispatchEvent(new window.CustomEvent(AUTH_CHANGED_EVENT));
}
