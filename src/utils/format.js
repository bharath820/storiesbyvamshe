export function toDateValue(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  if (typeof input === "string") return new Date(input);
  if (typeof input === "number") return new Date(input);
  if (typeof input?.toDate === "function") return input.toDate();
  return null;
}

export function prettyDate(input) {
  const dt = toDateValue(input);
  if (!dt) return "";
  return dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function prettyDateUpper(input) {
  const dt = toDateValue(input);
  if (!dt || Number.isNaN(dt.getTime())) return "";
  return dt
    .toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
    .toUpperCase();
}

export function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}
