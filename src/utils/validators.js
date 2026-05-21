export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || "");
}

export function isValidPhone(value) {
  return /^[0-9+\-\s()]{8,18}$/.test(value || "");
}

