"use server";

import { headers } from "next/headers";
import { site } from "@/lib/site";
import { buildInquiryEmail, getEmailConfig, sendEmail } from "@/lib/estimate/email";
import { checkSubmissionHeuristics, rateLimit, verifyTurnstile } from "@/lib/estimate/spam";
import type { EstimateFormState } from "@/lib/estimate/state";
import { validateInquiry } from "@/lib/estimate/validation";

const CALL_US = `Please call us at ${site.phone.display} instead.`;

export async function submitInquiry(
  prev: EstimateFormState,
  formData: FormData,
): Promise<EstimateFormState> {
  const attempt = prev.attempt + 1;
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || null;

  // 1. Cheap bot checks first. We don't reveal which check failed.
  const heuristics = checkSubmissionHeuristics(formData);
  if (!heuristics.ok) {
    const message =
      heuristics.reason === "too-fast"
        ? "That was quick! Please wait a moment and submit again."
        : heuristics.reason === "stale"
          ? "This form has been open for a long time. Please reload the page and try again."
          : `We couldn't accept this submission. ${CALL_US}`;
    return { status: "error", message, attempt };
  }

  if (!rateLimit(ip ?? "unknown")) {
    return {
      status: "error",
      message: `Too many requests from your connection. Please try again later, or call us at ${site.phone.display}.`,
      attempt,
    };
  }

  // 2. Field validation.
  const result = validateInquiry(formData);
  if (!result.ok) {
    return {
      status: "invalid",
      message: "Please fix the highlighted fields.",
      errors: result.errors,
      values: result.values,
      attempt,
    };
  }

  // 3. Optional Cloudflare Turnstile (enabled when TURNSTILE_SECRET_KEY is set).
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token = formData.get("cf-turnstile-response");
    const passed = await verifyTurnstile(typeof token === "string" ? token : "", ip, turnstileSecret);
    if (!passed) {
      return {
        status: "error",
        message: "We couldn't verify that you're human. Please complete the check and try again.",
        values: result.data,
        attempt,
      };
    }
  }

  // 4. Delivery. Never report success unless the provider accepted the message.
  const email = getEmailConfig();
  if (!email.configured) {
    console.warn(
      "[inquiry] Email delivery is not configured; submission was NOT delivered. Missing:",
      email.missing.join(", ") || "-",
      email.problems.join(" "),
    );
    return {
      status: "not_configured",
      message: `Our online form isn't accepting requests right now, so your message was not sent. ${CALL_US}`,
      values: result.data,
      attempt,
    };
  }

  try {
    await sendEmail(email.config, buildInquiryEmail(result.data, { submittedAt: new Date() }));
  } catch (err) {
    console.error("[inquiry] Delivery failed:", (err as Error).message);
    return {
      status: "error",
      message: `Something went wrong and your message was not sent. ${CALL_US}`,
      values: result.data,
      attempt,
    };
  }

  return {
    status: "success",
    message: `Thanks, ${result.data.name.split(" ")[0]}. We received your request and will call you back at ${result.data.phone}.`,
    attempt,
  };
}
