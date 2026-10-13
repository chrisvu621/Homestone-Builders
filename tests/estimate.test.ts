import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildEstimateEmail, getEmailConfig, sendEmail, type EmailConfig } from "@/lib/estimate/email";
import { HONEYPOT_FIELD, serviceOptions, timelineOptions } from "@/lib/estimate/options";
import { checkSubmissionHeuristics, rateLimit, resetRateLimitForTests } from "@/lib/estimate/spam";
import { normalizeUsPhone, validateEstimate } from "@/lib/estimate/validation";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = {
  name: "  Jane   Doe ",
  phone: "(714) 555-0123",
  email: "Jane@Example.com",
  city: "Garden Grove",
  service: serviceOptions[0],
  timeline: timelineOptions[1],
  description: "Full kitchen remodel, about 150 sq ft.\r\n\n\n\nNew cabinets.",
};

describe("validateEstimate", () => {
  it("accepts and normalizes a valid submission", () => {
    const r = validateEstimate(form(valid));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.name).toBe("Jane Doe");
    expect(r.data.phone).toBe("714-555-0123");
    expect(r.data.email).toBe("jane@example.com");
    expect(r.data.description).toBe("Full kitchen remodel, about 150 sq ft.\n\nNew cabinets.");
  });

  it("allows optional email and timeline to be blank", () => {
    const r = validateEstimate(form({ ...valid, email: "", timeline: "" }));
    expect(r.ok).toBe(true);
  });

  it("reports every missing required field", () => {
    const r = validateEstimate(form({}));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors).sort()).toEqual(["city", "description", "name", "phone", "service"]);
  });

  it("rejects values outside the allowed lists", () => {
    const r = validateEstimate(form({ ...valid, service: "Roofing", timeline: "yesterday" }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.service).toBeDefined();
    expect(r.errors.timeline).toBeDefined();
  });

  it("rejects bad email and phone, and over-long text", () => {
    const r = validateEstimate(
      form({ ...valid, email: "not-an-email", phone: "123", description: "x".repeat(3001) }),
    );
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.email).toBeDefined();
    expect(r.errors.phone).toBeDefined();
    expect(r.errors.description).toBeDefined();
  });

  it("strips header-injection characters from single-line fields", () => {
    const r = validateEstimate(form({ ...valid, name: "Jane\r\nBcc: evil@example.com" }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.name).not.toMatch(/[\r\n]/);
  });
});

describe("normalizeUsPhone", () => {
  it.each([
    ["714-475-2377", "714-475-2377"],
    ["+1 (714) 475 2377", "714-475-2377"],
    ["17144752377", "714-475-2377"],
    ["014-475-2377", null],
    ["714-075-2377", null],
    ["475-2377", null],
  ])("%s -> %s", (input, out) => expect(normalizeUsPhone(input)).toBe(out));
});

describe("checkSubmissionHeuristics", () => {
  const now = 1_700_000_000_000;
  it("passes a normal human submission", () => {
    expect(checkSubmissionHeuristics(form({ started_at: String(now - 20_000) }), now)).toEqual({ ok: true });
  });
  it("rejects a filled honeypot", () => {
    expect(checkSubmissionHeuristics(form({ [HONEYPOT_FIELD]: "x", started_at: String(now - 20_000) }), now).ok).toBe(false);
  });
  it("rejects missing timer and instant submissions", () => {
    expect(checkSubmissionHeuristics(form({}), now)).toEqual({ ok: false, reason: "missing-timer" });
    expect(checkSubmissionHeuristics(form({ started_at: String(now - 500) }), now)).toEqual({ ok: false, reason: "too-fast" });
  });
  it("rejects link spam", () => {
    const description = "see https://a.com https://b.com www.c.com";
    expect(checkSubmissionHeuristics(form({ started_at: String(now - 20_000), description }), now).ok).toBe(false);
  });
});

describe("rateLimit", () => {
  beforeEach(() => resetRateLimitForTests());
  it("allows 5 per window per key, then blocks", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(rateLimit("1.2.3.4", t + i)).toBe(true);
    expect(rateLimit("1.2.3.4", t + 10)).toBe(false);
    expect(rateLimit("5.6.7.8", t + 10)).toBe(true);
    expect(rateLimit("1.2.3.4", t + 11 * 60 * 1000)).toBe(true);
  });
});

describe("getEmailConfig", () => {
  it("reports missing variables instead of pretending to be configured", () => {
    const r = getEmailConfig({});
    expect(r.configured).toBe(false);
    if (r.configured) return;
    expect(r.missing).toEqual(["EMAIL_PROVIDER", "EMAIL_API_KEY", "EMAIL_FROM", "EMAIL_TO"]);
  });
  it("rejects unknown providers", () => {
    const r = getEmailConfig({ EMAIL_PROVIDER: "carrier-pigeon", EMAIL_API_KEY: "k", EMAIL_FROM: "a@b.co", EMAIL_TO: "c@d.co" });
    expect(r.configured).toBe(false);
  });
  it("parses a complete config with multiple recipients", () => {
    const r = getEmailConfig({ EMAIL_PROVIDER: "Resend", EMAIL_API_KEY: "k", EMAIL_FROM: "a@b.co", EMAIL_TO: "c@d.co, e@f.co" });
    expect(r).toEqual({ configured: true, config: { provider: "resend", apiKey: "k", from: "a@b.co", to: ["c@d.co", "e@f.co"] } });
  });
});

describe("sendEmail", () => {
  const email = buildEstimateEmail(
    { ...valid, name: "Jane Doe", phone: "714-555-0123", email: "jane@example.com" },
    { submittedAt: new Date("2026-01-01T18:00:00Z") },
  );
  const base: Omit<EmailConfig, "provider"> = { apiKey: "secret", from: "Site <site@example.com>", to: ["owner@example.com"] };

  it.each(["resend", "postmark", "sendgrid"] as const)("calls the %s API and includes reply-to", async (provider) => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: provider === "sendgrid" ? 202 : 200 }));
    await sendEmail({ ...base, provider }, email, fetchMock as unknown as typeof fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = String(init.body);
    expect(body).toContain("jane@example.com");
    expect(body).toContain("Jane Doe");
    expect(body).not.toContain("secret");
  });

  it("throws when the provider rejects the message", async () => {
    const fetchMock = vi.fn(async () => new Response("bad sender", { status: 422 }));
    await expect(sendEmail({ ...base, provider: "resend" }, email, fetchMock as unknown as typeof fetch)).rejects.toThrow(/422/);
  });
});
