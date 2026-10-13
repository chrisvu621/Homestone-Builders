import { services } from "../services";

export const serviceOptions = [...services.map((s) => s.label), "Other / not sure"] as const;

export const timelineOptions = [
  "As soon as possible",
  "Within 1–3 months",
  "In 3–6 months",
  "6+ months from now",
  "Just planning / gathering information",
] as const;

export const limits = {
  name: 100,
  email: 254,
  phone: 30,
  city: 80,
  description: 3000,
} as const;

/** Minimum time (ms) between the form becoming interactive and submission. */
export const MIN_FILL_MS = 3000;
/** Maximum age of a form session before we ask the visitor to reload. */
export const MAX_FILL_MS = 1000 * 60 * 60 * 24;

/** Name of the hidden honeypot field. Real visitors never see or fill it. */
export const HONEYPOT_FIELD = "company_website";
