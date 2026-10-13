import type { EstimateFields } from "./validation";

/**
 * Configurable email notification provider.
 *
 * Server-only: reads secrets from environment variables that are NOT prefixed
 * with NEXT_PUBLIC_, so they are never bundled into client code.
 *
 *   EMAIL_PROVIDER = resend | postmark | sendgrid
 *   EMAIL_API_KEY  = provider API key / server token
 *   EMAIL_FROM     = verified sender, e.g. "Homestone Website <estimates@yourdomain.com>"
 *   EMAIL_TO       = where leads are delivered (comma-separated for multiple)
 */

export const supportedProviders = ["resend", "postmark", "sendgrid"] as const;
export type EmailProvider = (typeof supportedProviders)[number];

export type EmailConfig = {
  provider: EmailProvider;
  apiKey: string;
  from: string;
  to: string[];
};

export type EmailConfigStatus =
  | { configured: true; config: EmailConfig }
  | { configured: false; missing: string[]; problems: string[] };

type Env = Record<string, string | undefined>;

export function getEmailConfig(env: Env = process.env): EmailConfigStatus {
  const missing: string[] = [];
  const problems: string[] = [];
  const provider = env.EMAIL_PROVIDER?.trim().toLowerCase();
  const apiKey = env.EMAIL_API_KEY?.trim();
  const from = env.EMAIL_FROM?.trim();
  const to = (env.EMAIL_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!provider) missing.push("EMAIL_PROVIDER");
  else if (!(supportedProviders as readonly string[]).includes(provider)) {
    problems.push(`EMAIL_PROVIDER must be one of: ${supportedProviders.join(", ")} (got "${provider}").`);
  }
  if (!apiKey) missing.push("EMAIL_API_KEY");
  if (!from) missing.push("EMAIL_FROM");
  if (to.length === 0) missing.push("EMAIL_TO");

  if (missing.length || problems.length) return { configured: false, missing, problems };
  return {
    configured: true,
    config: { provider: provider as EmailProvider, apiKey: apiKey!, from: from!, to },
  };
}

export type EstimateEmail = { subject: string; text: string; replyTo?: string };

export function buildEstimateEmail(data: EstimateFields, meta: { submittedAt: Date }): EstimateEmail {
  const lines = [
    "New estimate request from the Homestone Builders website",
    "",
    `Name:      ${data.name}`,
    `Phone:     ${data.phone}`,
    `Email:     ${data.email || "(not provided)"}`,
    `City:      ${data.city}`,
    `Service:   ${data.service}`,
    `Timeline:  ${data.timeline || "(not provided)"}`,
    "",
    "Project description:",
    data.description,
    "",
    `Submitted: ${meta.submittedAt.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })} (Pacific)`,
  ];
  // Subject is a single line; validation already stripped control characters.
  const subject = `Estimate request: ${data.service} – ${data.city} – ${data.name}`.slice(0, 200);
  return { subject, text: lines.join("\n"), replyTo: data.email || undefined };
}

/** Pulls the bare address out of "Name <addr@x.com>" for providers that want it separately. */
function parseAddress(value: string): { email: string; name?: string } {
  const m = value.match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/);
  if (m) return { name: m[1].replace(/^"|"$/g, "") || undefined, email: m[2] };
  return { email: value.trim() };
}

export class EmailDeliveryError extends Error {}

export async function sendEmail(
  config: EmailConfig,
  email: EstimateEmail,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  let url: string;
  let headers: Record<string, string>;
  let body: unknown;

  switch (config.provider) {
    case "resend":
      url = "https://api.resend.com/emails";
      headers = { Authorization: `Bearer ${config.apiKey}` };
      body = {
        from: config.from,
        to: config.to,
        subject: email.subject,
        text: email.text,
        ...(email.replyTo ? { reply_to: email.replyTo } : {}),
      };
      break;
    case "postmark":
      url = "https://api.postmarkapp.com/email";
      headers = { "X-Postmark-Server-Token": config.apiKey, Accept: "application/json" };
      body = {
        From: config.from,
        To: config.to.join(","),
        Subject: email.subject,
        TextBody: email.text,
        MessageStream: "outbound",
        ...(email.replyTo ? { ReplyTo: email.replyTo } : {}),
      };
      break;
    case "sendgrid":
      url = "https://api.sendgrid.com/v3/mail/send";
      headers = { Authorization: `Bearer ${config.apiKey}` };
      body = {
        personalizations: [{ to: config.to.map((e) => ({ email: e })) }],
        from: parseAddress(config.from),
        subject: email.subject,
        content: [{ type: "text/plain", value: email.text }],
        ...(email.replyTo ? { reply_to: { email: email.replyTo } } : {}),
      };
      break;
  }

  let res: Response;
  try {
    res = await fetchImpl(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    throw new EmailDeliveryError(`${config.provider}: network error (${(err as Error).message})`);
  }
  if (!res.ok) {
    // Log the provider's message (never the API key) to help diagnose setup issues.
    const detail = (await res.text().catch(() => "")).slice(0, 500);
    throw new EmailDeliveryError(`${config.provider}: HTTP ${res.status} ${detail}`);
  }
}
