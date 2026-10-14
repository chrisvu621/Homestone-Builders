import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildInquiryEmail, getEmailConfig, sendEmail, type EmailConfig } from "@/lib/estimate/email";
import { HONEYPOT_FIELD, reasonOptions, topicOptions } from "@/lib/estimate/options";
import { checkSubmissionHeuristics, rateLimit, resetRateLimitForTests } from "@/lib/estimate/spam";
import { normalizeUsPhone, validateInquiry } from "@/lib/estimate/validation";

function form(fields: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

const valid = {
  name: "  Jane   Doe ",
  phone: "(714) 555-0123",
  reason: reasonOptions[0],
  message: "Kitchen remodel, about 150 sq ft.\r\n\n\n\nNew cabinets.",
};

describe("validateInquiry", () => {
  it("accepts and normalizes a valid submission", () => {
    const r = validateInquiry(form(valid));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.name).toBe("Jane Doe");
    expect(r.data.phone).toBe("714-555-0123");
    expect(r.data.reason).toBe("Request an estimate");
    expect(r.data.message).toBe("Kitchen remodel, about 150 sq ft.\n\nNew cabinets.");
  });

  it("allows the message to be blank", () => {
    expect(validateInquiry(form({ ...valid, message: "" })).ok).toBe(true);
  });

  it("requires only name, phone and reason", () => {
    const r = validateInquiry(form({}));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(Object.keys(r.errors).sort()).toEqual(["name", "phone", "reason"]);
  });

  it("rejects a reason outside the allowed list", () => {
    const r = validateInquiry(form({ ...valid, reason: "Sell me something" }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.reason).toBeDefined();
  });

  it("rejects a bad phone number and an over-long message", () => {
    const r = validateInquiry(form({ ...valid, phone: "123", message: "x".repeat(2001) }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.phone).toBeDefined();
    expect(r.errors.message).toBeDefined();
  });

  it("keeps a known service-page topic and drops unknown ones", () => {
    const ok = validateInquiry(form({ ...valid, topic: topicOptions[0] }));
    const bad = validateInquiry(form({ ...valid, topic: "<script>" }));
    expect(ok.ok && ok.data.topic).toBe(topicOptions[0]);
    expect(bad.ok && bad.data.topic).toBe("");
  });

  it("strips header-injection characters from single-line fields", () => {
    const r = validateInquiry(form({ ...valid, name: "Jane\r\nBcc: evil@example.com" }));
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
    const message = "see https://a.com https://b.com www.c.com";
    expect(checkSubmissionHeuristics(form({ started_at: String(now - 20_000), message }), now).ok).toBe(false);
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

describe("buildInquiryEmail", () => {
  const at = { submittedAt: new Date("2026-01-01T18:00:00Z") };
  it("includes name, phone, reason and message", () => {
    const e = buildInquiryEmail({ name: "Jane Doe", phone: "714-555-0123", reason: "Discuss a project", message: "ADU in backyard", topic: "" }, at);
    for (const v of ["Jane Doe", "714-555-0123", "Discuss a project", "ADU in backyard"]) expect(e.text).toContain(v);
    expect(e.subject).toContain("Jane Doe");
    expect(e.subject).toContain("714-555-0123");
  });
  it("says when no message was left, and notes the service page", () => {
    const e = buildInquiryEmail({ name: "Jo", phone: "714-555-0123", reason: "Request an estimate", message: "", topic: "Kitchen remodeling" }, at);
    expect(e.text).toContain("(none)");
    expect(e.text).toContain("Came from:  Kitchen remodeling page");
  });
});

describe("sendEmail", () => {
  const email = buildInquiryEmail(
    { name: "Jane Doe", phone: "714-555-0123", reason: "General question", message: "Hello", topic: "" },
    { submittedAt: new Date("2026-01-01T18:00:00Z") },
  );
  const base: Omit<EmailConfig, "provider"> = { apiKey: "secret", from: "Site <site@example.com>", to: ["owner@example.com"] };

  it.each(["resend", "postmark", "sendgrid"] as const)("calls the %s API with the full inquiry", async (provider) => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: provider === "sendgrid" ? 202 : 200 }));
    await sendEmail({ ...base, provider }, email, fetchMock as unknown as typeof fetch);
    expect(fetchMock).toHaveBeenCalledOnce();
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    const body = String(init.body);
    for (const v of ["Jane Doe", "714-555-0123", "General question", "Hello"]) expect(body).toContain(v);
    expect(body).not.toContain("secret");
  });

  it("throws when the provider rejects the message", async () => {
    const fetchMock = vi.fn(async () => new Response("bad sender", { status: 422 }));
    await expect(sendEmail({ ...base, provider: "resend" }, email, fetchMock as unknown as typeof fetch)).rejects.toThrow(/422/);
  });
});
