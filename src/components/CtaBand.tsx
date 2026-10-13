import Link from "next/link";
import { site } from "@/lib/site";
import { PhoneIcon } from "./Icons";

export function CtaBand({
  heading = "Ready to talk about your project?",
  body = "Call us or send a few details about what you have in mind. We'll follow up to discuss scope and next steps.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="stone-surface text-ivory">
      <div className="container-page flex flex-col gap-8 py-16 md:flex-row md:items-center md:justify-between md:py-20">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-semibold md:text-4xl">{heading}</h2>
          <p className="text-lg text-sand/85">{body}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:shrink-0">
          <Link href="/contact" className="btn btn-primary">
            Request an Estimate
          </Link>
          <a href={site.phone.href} className="btn btn-outline border-sand/50 text-ivory">
            <PhoneIcon /> {site.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
