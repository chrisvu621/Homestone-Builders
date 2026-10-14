import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[60vh] flex-col items-start justify-center gap-5 py-20">
      <p className="eyebrow">404</p>
      <h1 className="text-5xl">We couldn&apos;t find that page</h1>
      <p className="text-lg text-ink-soft">Try one of these instead, or call us at {site.phone.display}.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Home</Link>
        <Link href="/services" className="btn btn-outline">Services</Link>
        <Link href="/contact" className="btn btn-outline">Request an Estimate</Link>
      </div>
    </section>
  );
}
