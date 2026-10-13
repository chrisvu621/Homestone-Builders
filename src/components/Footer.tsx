import Link from "next/link";
import { services } from "@/lib/services";
import { primaryCitiesText, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-charcoal pb-28 text-sand md:pb-0">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div className="space-y-4">
          <Logo tone="light" />
          <p className="max-w-sm text-sm leading-relaxed text-sand/80">
            {site.name} is a licensed California general contractor serving {primaryCitiesText}, and other Orange
            County cities on a project-by-project basis.
          </p>
          <p className="text-sm">
            CSLB License #{site.licenseNumber}
          </p>
          <a href={site.phone.href} className="inline-block text-lg font-semibold text-ivory hover:text-clay-light">
            {site.phone.display}
          </a>
        </div>
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand/70">Services</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-ivory">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand/70">Company</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/gallery" className="hover:text-ivory">Project Gallery</Link></li>
            <li><Link href="/about" className="hover:text-ivory">About</Link></li>
            <li><Link href="/contact" className="hover:text-ivory">Request an Estimate</Link></li>
            <li><Link href="/privacy" className="hover:text-ivory">Privacy Policy</Link></li>
          </ul>
          <h2 className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-sand/70">Materials showroom</h2>
          <p className="mt-3 text-sm leading-relaxed text-sand/80">
            {site.showroom.street}, {site.showroom.city}, {site.showroom.state}
            <br />
            Operated by {site.showroom.operator}, a separate business.
          </p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-6 text-xs text-sand/60">
          © {site.name}. All rights reserved. Showroom operated by {site.showroom.operator}; construction and
          installation performed by {site.name}.
        </p>
      </div>
    </footer>
  );
}
