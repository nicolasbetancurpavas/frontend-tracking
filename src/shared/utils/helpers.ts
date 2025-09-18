/* ----------------- helpers de headers ----------------- */
export function normLang(): string {
  const raw = String(navigator?.language || "es"); // ej: "es-419", "es-CO"
  const m = raw.match(/^([a-z]{2})(?:-([A-Za-z]{2}))?$/i);
  if (!m) return "es";
  return m[2]
    ? `${m[1].toLowerCase()}-${m[2].toUpperCase()}`
    : m[1].toLowerCase();
}

export function newRequestId(): string {
  return globalThis.crypto && "randomUUID" in globalThis.crypto
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}
