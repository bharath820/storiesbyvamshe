const ADMIN_SESSION_KEY = "storiesbyvamshe.admin.session.v1";
const AUTH_CHANGED_EVENT = "storiesbyvamshe:auth-changed";

export const DUMMY_ADMIN_EMAIL = "admin@stories.local";
export const DUMMY_ADMIN_PASSWORD = "Admin@12345";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function emitAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new window.CustomEvent(AUTH_CHANGED_EVENT));
}

function parseSession(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.isAdmin !== true) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getAdminSession() {
  if (!canUseStorage()) return null;
  return parseSession(window.localStorage.getItem(ADMIN_SESSION_KEY));
}

export function isAdminLoggedIn() {
  return Boolean(getAdminSession());
}

export function subscribeToAuthChanges(callback) {
  if (typeof window === "undefined") return () => {};

  const onCustom = () => callback();
  const onStorage = (event) => {
    if (event.key === ADMIN_SESSION_KEY) callback();
  };

  window.addEventListener(AUTH_CHANGED_EVENT, onCustom);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(AUTH_CHANGED_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

export function loginAdmin(email, password) {
  const normalizedEmail = (email || "").trim().toLowerCase();
  const normalizedPassword = password || "";

  if (normalizedEmail !== DUMMY_ADMIN_EMAIL || normalizedPassword !== DUMMY_ADMIN_PASSWORD) {
    return Promise.reject(new Error("Invalid admin credentials."));
  }

  if (!canUseStorage()) {
    return Promise.reject(new Error("Admin login requires browser storage support."));
  }

  const session = {
    isAdmin: true,
    email: DUMMY_ADMIN_EMAIL,
    loggedInAt: new Date().toISOString()
  };
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  emitAuthChanged();
  return Promise.resolve(session);
}

export function logoutAdmin() {
  if (!canUseStorage()) return Promise.resolve();
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
  emitAuthChanged();
  return Promise.resolve();
}
