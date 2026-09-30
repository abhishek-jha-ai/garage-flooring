import type { Lead, ValidationResult } from "./types";

export const phoneDigits = (v: string) => v.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isZip = (v: string) => /^\d{5}$/.test(v.trim());

export function validateContact(v: { name: string; phone: string; email: string; zip: string }) {
  const errors: Record<string, string> = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name";
  if (phoneDigits(v.phone).length !== 10) errors.phone = "Enter a 10-digit phone number";
  if (!isEmail(v.email)) errors.email = "Enter a valid email";
  if (!isZip(v.zip)) errors.zip = "5-digit ZIP";
  return errors;
}

const str = (x: unknown, max = 200) => (typeof x === "string" ? x.trim().slice(0, max) : "");

export function validateLead(body: unknown): ValidationResult {
  const b = (body ?? {}) as Record<string, unknown>;
  const lead: Lead = {
    projectType: str(b.projectType, 40),
    size: str(b.size, 40),
    timeline: str(b.timeline, 40),
    name: str(b.name, 100),
    phone: str(b.phone, 30),
    email: str(b.email, 200),
    zip: str(b.zip, 10),
    finish: str(b.finish, 40) || undefined,
    source: str(b.source, 200) || undefined,
    utm:
      b.utm && typeof b.utm === "object"
        ? Object.fromEntries(Object.entries(b.utm as Record<string, unknown>).map(([k, v]) => [k.slice(0, 40), str(v)]))
        : undefined,
    submittedAt: new Date().toISOString(),
  };
  const errors = validateContact(lead);
  if (!lead.projectType) errors.projectType = "Required";
  if (!lead.timeline) errors.timeline = "Required";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, lead };
}
