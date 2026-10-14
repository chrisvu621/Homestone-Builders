import { services } from "../services";

/** "How can we help?" choices. Required. */
export const reasonOptions = ["Request an estimate", "Discuss a project", "General question"] as const;

/**
 * Service pages link to /contact?service=<label>. The page is passed along as a
 * hidden field so the notification says where the visitor came from.
 */
export const topicOptions = services.map((s) => s.label);

export const limits = {
  name: 100,
  phone: 30,
  message: 2000,
} as const;

/** Minimum time (ms) between the form becoming interactive and submission. */
export const MIN_FILL_MS = 3000;
/** Maximum age of a form session before we ask the visitor to reload. */
export const MAX_FILL_MS = 1000 * 60 * 60 * 24;

/** Name of the hidden honeypot field. Real visitors never see or fill it. */
export const HONEYPOT_FIELD = "company_website";
