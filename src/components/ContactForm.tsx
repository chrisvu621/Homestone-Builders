"use client";

import Link from "next/link";
import Script from "next/script";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitInquiry } from "@/app/contact/actions";
import { HONEYPOT_FIELD, limits, reasonOptions, topicOptions } from "@/lib/estimate/options";
import { initialEstimateState } from "@/lib/estimate/state";
import type { FieldErrors } from "@/lib/estimate/validation";
import { site } from "@/lib/site";
import { Check, PhoneIcon } from "./Icons";

type Turnstile = {
  render: (el: HTMLElement, opts: { sitekey: string; theme?: string; size?: string }) => string;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

// 17px text keeps iOS from zooming into fields; 3.5rem height gives an easy tap target.
const inputCls =
  "block w-full rounded-[2px] border border-line bg-white px-4 text-[1.0625rem] text-ink placeholder:text-ink-soft/55 focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none aria-[invalid=true]:border-red-700 aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-700";

export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey?: string }) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialEstimateState);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [topic, setTopic] = useState("");
  const estimateRadio = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const turnstileEl = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | null>(null);

  // Start the spam timer once the form is interactive. Visitors arriving from a
  // service page's "Request an Estimate" button get that option preselected.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only values after hydration
    setStartedAt(Date.now());
    const fromService = new URLSearchParams(window.location.search).get("service");
    if (fromService && topicOptions.includes(fromService)) {
      setTopic(fromService);
      if (estimateRadio.current) estimateRadio.current.checked = true;
    }
  }, []);

  // After each submission, focus the message for screen readers and scroll it below the sticky header.
  useEffect(() => {
    if (state.attempt > 0 && statusRef.current) {
      statusRef.current.focus({ preventScroll: true });
      statusRef.current.scrollIntoView({ block: "start" });
    }
    if (state.attempt > 0 && turnstileId.current && window.turnstile) window.turnstile.reset(turnstileId.current);
  }, [state]);

  const renderTurnstile = () => {
    if (!turnstileSiteKey || !turnstileEl.current || !window.turnstile || turnstileId.current) return;
    turnstileId.current = window.turnstile.render(turnstileEl.current, { sitekey: turnstileSiteKey, theme: "light" });
  };

  if (state.status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="py-4 outline-none">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="type-h2 mt-6">Thank you. We&apos;ll be in touch.</h2>
        <p className="mt-3 max-w-md text-ink-soft">{state.message}</p>
        <p className="mt-6 text-sm text-ink-soft">
          Need us sooner? Call{" "}
          <a href={site.phone.href} className="link-quiet text-ink tabular-nums">
            {site.phone.display}
          </a>
          .
        </p>
      </div>
    );
  }

  const err: FieldErrors = state.errors ?? {};
  const errorCount = Object.keys(err).length;
  const invalid = (name: keyof FieldErrors) => ({
    "aria-invalid": err[name] ? true : undefined,
    "aria-describedby": err[name] ? `f-${name}-error` : undefined,
  });

  return (
    <form
      action={formAction}
      // With JavaScript, submit via a transition so React doesn't clear what the visitor typed if a fix is needed.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
      noValidate
      className="space-y-6"
    >
      {state.status === "invalid" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-red-800 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900 outline-none"
        >
          Please check the {errorCount === 1 ? "field" : `${errorCount} fields`} marked below.
        </div>
      )}
      {(state.status === "error" || state.status === "not_configured") && (
        <div ref={statusRef} tabIndex={-1} role="alert" className="border-l-2 border-red-800 bg-red-50 px-4 py-4 outline-none">
          <p className="text-[0.95rem] text-red-900">
            {/* Keep the phone number on one line. */}
            {state.message?.split(site.phone.display).map((part, i, all) => (
              <span key={i}>
                {part}
                {i < all.length - 1 && <span className="whitespace-nowrap">{site.phone.display}</span>}
              </span>
            ))}
          </p>
          <a href={site.phone.href} className="btn btn-primary mt-4 w-full sm:w-auto">
            <PhoneIcon className="h-4 w-4" /> Call {site.phone.display}
          </a>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
        <div>
          <label htmlFor="f-name" className="mb-2 block text-[0.95rem] font-medium">
            Name
          </label>
          <input
            id="f-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={limits.name}
            className={`${inputCls} h-14`}
            {...invalid("name")}
          />
          <ErrorText errors={err} name="name" />
        </div>
        <div>
          <label htmlFor="f-phone" className="mb-2 block text-[0.95rem] font-medium">
            Phone number
          </label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={limits.phone}
            className={`${inputCls} h-14 tabular-nums`}
            {...invalid("phone")}
          />
          <ErrorText errors={err} name="phone" />
        </div>
      </div>

      <fieldset>
        <legend id="f-reason-label" className="mb-2 block text-[0.95rem] font-medium">
          How can we help?
        </legend>
        <div
          role="radiogroup"
          aria-labelledby="f-reason-label"
          aria-required="true"
          className="grid gap-2 sm:grid-cols-3"
          {...invalid("reason")}
        >
          {reasonOptions.map((option, i) => (
            <label
              key={option}
              className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-[2px] border bg-white px-4 py-3 text-[1rem] transition-colors has-[input:checked]:border-ink has-[input:checked]:ring-1 has-[input:checked]:ring-ink has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ink ${
                err.reason ? "border-red-700" : "border-line hover:border-ink-soft"
              }`}
            >
              <input
                ref={i === 0 ? estimateRadio : undefined}
                type="radio"
                name="reason"
                value={option}
                required
                className="h-5 w-5 shrink-0 accent-ink focus:outline-none"
              />
              {option}
            </label>
          ))}
        </div>
        <ErrorText errors={err} name="reason" />
      </fieldset>

      <div>
        <label htmlFor="f-message" className="mb-2 block text-[0.95rem] font-medium">
          Message <span className="font-normal text-ink-soft">(optional)</span>
        </label>
        <textarea
          id="f-message"
          name="message"
          rows={4}
          maxLength={limits.message}
          placeholder="Tell us a little about what you need..."
          className={`${inputCls} min-h-32 py-3 leading-relaxed`}
          {...invalid("message")}
        />
        <ErrorText errors={err} name="message" />
      </div>

      {/* Spam protection: honeypot (hidden from people and assistive tech) and a fill-time stamp. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="started_at" value={startedAt ?? ""} />
      <input type="hidden" name="topic" value={topic} />

      {turnstileSiteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={renderTurnstile} />
          <div ref={turnstileEl} />
        </>
      )}

      <div className="space-y-4">
        <button
          type="submit"
          disabled={pending || startedAt === null}
          className="btn btn-primary min-h-14 w-full px-10 text-base sm:w-auto disabled:opacity-60"
        >
          {pending ? "Sending…" : "Request a Callback"}
        </button>
        <p className="text-sm text-ink-soft">
          Prefer to call?{" "}
          <a href={site.phone.href} className="link-quiet text-ink tabular-nums">
            {site.phone.display}
          </a>
          . We use your details only to respond to you. See our{" "}
          <Link href="/privacy" className="link-quiet text-ink">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

function ErrorText({ errors, name }: { errors: FieldErrors; name: keyof FieldErrors }) {
  if (!errors[name]) return null;
  return (
    <p id={`f-${name}-error`} className="mt-2 text-[0.85rem] leading-snug text-red-800">
      {errors[name]}
    </p>
  );
}
