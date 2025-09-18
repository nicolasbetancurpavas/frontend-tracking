// src/shared/api/errors.ts
import type { AxiosError } from "axios";

export type FieldErrors = Record<string, string>;

// Espera: { message, details: [{ field, message }, ...] }
export function parseJoiErrors(data: any): FieldErrors {
  const out: FieldErrors = {};
  const arr = Array.isArray(data?.details) ? data.details : [];
  for (const it of arr) {
    const field = typeof it?.field === "string" ? it.field : undefined;
    const msg = typeof it?.message === "string" ? it.message : undefined;
    if (field && msg) out[field] = msg;
  }
  if (!Object.keys(out).length && typeof data?.message === "string") {
    out.general = data.message;
  }
  return out;
}

export const extractApiErrorPayload = (e: unknown) =>
  (e as AxiosError)?.response?.data ?? null;
