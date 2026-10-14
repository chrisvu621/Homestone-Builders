import Link from "next/link";
import { site } from "@/lib/site";

export function CtaBand({
  heading = "Let's talk about your project.",
  body = "Call us or send a few details. We'll follow up to discuss scope and next steps.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="bg-sand">
      <div className="container-page flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-24">
        <div className="max-w-xl space-y-4">
          <h2 className="type-h2">{heading}</h2>
          <p className="text-ink-soft md:text-lg">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
          <Link href="/contact" className="btn btn-primary">
            Request an Estimate
          </Link>
          <a href={site.phone.href} className="btn btn-outline text-ink tabular-nums">
            Call {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
