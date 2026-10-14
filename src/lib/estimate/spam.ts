import { HONEYPOT_FIELD, MAX_FILL_MS, MIN_FILL_MS } from "./options";

export type SpamVerdict = { ok: true } | { ok: false; reason: string };

/**
 * Cheap, privacy-friendly bot checks that run before anything else:
 * - a hidden honeypot field that humans never fill in
 * - a minimum fill time (bots submit instantly)
 * - a cap on links in the message (link spam)
 */
export function checkSubmissionHeuristics(formData: FormData, now = Date.now()): SpamVerdict {
  const honeypot = formData.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return { ok: false, reason: "honeypot" };
  }

  const startedRaw = formData.get("started_at");
  const startedAt = typeof startedRaw === "string" ? Number(startedRaw) : NaN;
  if (!Number.isFinite(startedAt) || startedAt <= 0) return { ok: false, reason: "missing-timer" };
  const elapsed = now - startedAt;
  if (elapsed < MIN_FILL_MS) return { ok: false, reason: "too-fast" };
  if (elapsed > MAX_FILL_MS) return { ok: false, reason: "stale" };

  const message = formData.get("message");
  if (typeof message === "string") {
    const links = message.match(/https?:\/\/|www\./gi)?.length ?? 0;
    if (links > 2) return { ok: false, reason: "links" };
  }
  return { ok: true };
}

/**
 * Best-effort in-memory rate limit per IP. On serverless platforms each
 * instance has its own memory, so this slows down bursts but is not a hard
 * global limit. Pair it with Cloudflare Turnstile for stronger protection.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function rateLimit(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return true;
}

export function resetRateLimitForTests() {
  hits.clear();
}

/** Server-side verification of a Cloudflare Turnstile token. Only used when TURNSTILE_SECRET_KEY is set. */
export async function verifyTurnstile(token: string, ip: string | null, secret: string): Promise<boolean> {
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
