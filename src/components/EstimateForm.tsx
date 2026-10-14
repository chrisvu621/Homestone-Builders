"use client";

import Link from "next/link";
import Script from "next/script";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { submitEstimate } from "@/app/contact/actions";
import { HONEYPOT_FIELD, limits, serviceOptions, timelineOptions } from "@/lib/estimate/options";
import { initialEstimateState } from "@/lib/estimate/state";
import type { EstimateFields, FieldErrors } from "@/lib/estimate/validation";
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

const inputCls =
  "block w-full rounded-none border-0 border-b border-ink/30 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink-soft/50 focus:border-ink focus:shadow-[0_1px_0_0_#242625] focus:ring-0 focus:outline-none aria-[invalid=true]:border-red-700";

export function EstimateForm({
  cities,
  turnstileSiteKey,
}: {
  cities: readonly string[];
  turnstileSiteKey?: string;
}) {
  const [state, formAction, pending] = useActionState(submitEstimate, initialEstimateState);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const turnstileEl = useRef<HTMLDivElement>(null);
  const turnstileId = useRef<string | null>(null);

  // Start the spam timer once the form is interactive, and honor ?service= links from service pages.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser-only values after hydration
    setStartedAt(Date.now());
    const wanted = new URLSearchParams(window.location.search).get("service");
    if (wanted && serviceRef.current && (serviceOptions as readonly string[]).includes(wanted)) {
      serviceRef.current.value = wanted;
    }
  }, []);

  // Move focus to the status message after each submission so screen readers announce it.
  useEffect(() => {
    if (state.attempt > 0 && statusRef.current) {
      // Focus for screen readers, then scroll so the message sits below the sticky header.
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
      <div ref={statusRef} tabIndex={-1} role="status" className="border-t border-ink py-10 text-center outline-none">
        <span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-canvas">
          <Check className="h-6 w-6" />
        </span>
        <h2 className="type-h2">Request received</h2>
        <p className="mt-3 text-ink-soft">{state.message}</p>
        <p className="mt-4 text-sm text-ink-soft">
          Need to reach us sooner? Call <a href={site.phone.href} className="text-ink underline decoration-accent underline-offset-4">{site.phone.display}</a>.
        </p>
      </div>
    );
  }

  const err = state.errors ?? {};
  const fieldProps = (name: keyof EstimateFields) => ({
    id: `f-${name}`,
    name,
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
      className="space-y-5"
      aria-describedby="form-required-note"
    >
      {state.status !== "idle" && (
        <div
          ref={statusRef}
          tabIndex={-1}
          role="alert"
          className="border-l-2 border-red-800 bg-red-50 px-4 py-3 text-[0.95rem] text-red-900 outline-none"
        >
          <p className="font-medium">
            {state.status === "invalid" && state.errors
              ? `Please check the ${Object.keys(state.errors).length === 1 ? "field" : `${Object.keys(state.errors).length} fields`} marked below.`
              : state.message}
          </p>
          {state.status !== "invalid" && (
            <a href={site.phone.href} className="mt-3 inline-flex items-center gap-2 font-medium text-ink underline decoration-accent underline-offset-4">
              <PhoneIcon className="h-4 w-4" /> Call {site.phone.display}
            </a>
          )}
        </div>
      )}

      <p id="form-required-note" className="text-sm text-ink-soft">
        Fields marked * are required.
      </p>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label name="name">Name</Label>
          <input {...fieldProps("name")} type="text" autoComplete="name" required maxLength={limits.name} className={inputCls} />
          <ErrorText errors={err} name="name" />
        </div>
        <div>
          <Label name="phone">Phone</Label>
          <input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" required maxLength={limits.phone} className={inputCls} placeholder="714-555-0123" />
          <ErrorText errors={err} name="phone" />
        </div>
        <div>
          <Label name="email" optional>Email</Label>
          <input {...fieldProps("email")} type="email" autoComplete="email" maxLength={limits.email} className={inputCls} />
          <ErrorText errors={err} name="email" />
        </div>
        <div>
          <Label name="city">Project city</Label>
          <input {...fieldProps("city")} type="text" list="city-options" autoComplete="address-level2" required maxLength={limits.city} className={inputCls} />
          <datalist id="city-options">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          <ErrorText errors={err} name="city" />
        </div>
        <div>
          <Label name="service">Service</Label>
          <select {...fieldProps("service")} required ref={serviceRef} defaultValue="" className={inputCls}>
            <option value="" disabled>
              Choose a service…
            </option>
            {serviceOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ErrorText errors={err} name="service" />
        </div>
        <div className="sm:col-span-2">
          <Label name="timeline" optional>Timeline</Label>
          <select {...fieldProps("timeline")} defaultValue="" className={inputCls}>
            <option value="">Choose a timeline…</option>
            {timelineOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <ErrorText errors={err} name="timeline" />
        </div>
        <div className="sm:col-span-2">
          <Label name="description">Project description</Label>
          <textarea
            {...fieldProps("description")}
            required
            rows={6}
            maxLength={limits.description}
           
            className={inputCls}
            placeholder="What would you like to build or change? Include rough size, current condition and anything you've already decided."
          />
          <ErrorText errors={err} name="description" />
        </div>
      </div>

      {/* Spam protection: honeypot (hidden from people and assistive tech) and a fill-time stamp. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>
      <input type="hidden" name="started_at" value={startedAt ?? ""} />

      {turnstileSiteKey && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={renderTurnstile} />
          <div ref={turnstileEl} />
        </>
      )}

      <div className="space-y-3 pt-1">
        <button type="submit" disabled={pending || startedAt === null} className="btn btn-primary w-full px-10 sm:w-auto disabled:opacity-60">
          {pending ? "Sending…" : "Send Estimate Request"}
        </button>
        <p className="text-sm text-ink-soft">
          We use these details only to respond about your project. See our{" "}
          <Link href="/privacy" className="link-quiet text-ink">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}

function Label({ name, children, optional }: { name: string; children: string; optional?: boolean }) {
  return (
    <label htmlFor={`f-${name}`} className="block text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
      {children}
      {optional ? (
        <span className="ml-1 font-normal tracking-normal normal-case">(optional)</span>
      ) : (
        <span aria-hidden="true" className="ml-0.5">*</span>
      )}
    </label>
  );
}

function ErrorText({ errors, name }: { errors: FieldErrors; name: keyof EstimateFields }) {
  if (!errors[name]) return null;
  return (
    <p id={`f-${name}-error`} className="mt-2 text-[0.82rem] leading-snug text-red-800">
      {errors[name]}
    </p>
  );
}
