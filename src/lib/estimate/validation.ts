import { limits, reasonOptions, topicOptions } from "./options";

export type InquiryFields = {
  name: string;
  phone: string;
  reason: string;
  message: string;
  /** Service page the visitor came from, if any (hidden field, not shown to the visitor). */
  topic: string;
};

export type FieldErrors = Partial<Record<"name" | "phone" | "reason" | "message", string>>;

export type ValidationResult =
  | { ok: true; data: InquiryFields }
  | { ok: false; errors: FieldErrors; values: InquiryFields };

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

export function validateInquiry(formData: FormData): ValidationResult {
  const topic = clean(str(formData.get("topic")));
  const values: InquiryFields = {
    name: clean(str(formData.get("name"))),
    phone: clean(str(formData.get("phone"))),
    reason: clean(str(formData.get("reason"))),
    message: clean(str(formData.get("message")), true),
    // Unknown topics are dropped silently; the field is informational only.
    topic: topicOptions.includes(topic) ? topic : "",
  };
  const errors: FieldErrors = {};

  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > limits.name) errors.name = `Please keep your name under ${limits.name} characters.`;

  const phone = normalizeUsPhone(values.phone);
  if (!values.phone) errors.phone = "Please enter a phone number so we can call you back.";
  else if (values.phone.length > limits.phone || !phone) errors.phone = "Please enter a 10-digit US phone number.";

  if (!(reasonOptions as readonly string[]).includes(values.reason)) {
    errors.reason = "Please choose how we can help.";
  }

  if (values.message.length > limits.message) {
    errors.message = `Please keep your message under ${limits.message} characters.`;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors, values };
  return { ok: true, data: { ...values, phone: phone! } };
}
