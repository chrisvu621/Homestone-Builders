import { limits, serviceOptions, timelineOptions } from "./options";

export type EstimateFields = {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  timeline: string;
  description: string;
};

export type FieldErrors = Partial<Record<keyof EstimateFields, string>>;

export type ValidationResult =
  | { ok: true; data: EstimateFields }
  | { ok: false; errors: FieldErrors; values: EstimateFields };

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v : "";
}

/** Collapse whitespace and strip control characters (keeps newlines in multi-line fields). */
function clean(v: string, multiline = false): string {
  const noCtrl = v.replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ");
  if (multiline) {
    return noCtrl
      .split("\n")
      .map((l) => l.replace(/\s+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  return noCtrl.replace(/\s+/g, " ").trim();
}

/** Returns a normalized 10-digit US phone number, or null. */
export function normalizeUsPhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  if (digits.length !== 10) return null;
  // NANP: area code and exchange cannot start with 0 or 1.
  if (/^[01]/.test(digits) || /^[01]/.test(digits.slice(3))) return null;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function validateEstimate(formData: FormData): ValidationResult {
  const values: EstimateFields = {
    name: clean(str(formData.get("name"))),
    phone: clean(str(formData.get("phone"))),
    email: clean(str(formData.get("email"))).toLowerCase(),
    city: clean(str(formData.get("city"))),
    service: clean(str(formData.get("service"))),
    timeline: clean(str(formData.get("timeline"))),
    description: clean(str(formData.get("description")), true),
  };
  const errors: FieldErrors = {};

  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > limits.name) errors.name = `Please keep your name under ${limits.name} characters.`;

  const phone = normalizeUsPhone(values.phone);
  if (!values.phone) errors.phone = "Please enter a phone number so we can reach you.";
  else if (values.phone.length > limits.phone || !phone) errors.phone = "Please enter a valid 10-digit US phone number.";

  if (values.email) {
    if (values.email.length > limits.email || !EMAIL_RE.test(values.email)) {
      errors.email = "Please enter a valid email address, or leave it blank.";
    }
  }

  if (!values.city) errors.city = "Please enter the city where the project is located.";
  else if (values.city.length > limits.city) errors.city = `Please keep the city under ${limits.city} characters.`;

  if (!(serviceOptions as readonly string[]).includes(values.service)) {
    errors.service = "Please choose a service.";
  }

  if (values.timeline && !(timelineOptions as readonly string[]).includes(values.timeline)) {
    errors.timeline = "Please choose a timeline from the list.";
  }

  if (!values.description) errors.description = "Please tell us a little about the project.";
  else if (values.description.length < 10) errors.description = "Please add a few more details about the project.";
  else if (values.description.length > limits.description) {
    errors.description = `Please keep the description under ${limits.description} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors, values };
  return { ok: true, data: { ...values, phone: phone! } };
}
