import Link from "next/link";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink pb-24 text-canvas lg:pb-0">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] md:py-20">
        <div className="space-y-5">
          <Logo tone="light" />
          <p className="text-sm text-canvas/70">Licensed California General Contractor · CSLB #{site.licenseNumber}</p>
          <a href={site.phone.href} className="inline-block text-xl font-medium tracking-wide tabular-nums hover:text-sand">
            {site.phone.display}
          </a>
        </div>
        <div>
          <h2 className="font-sans text-[0.7rem] font-medium tracking-[0.18em] text-canvas/60 uppercase">Services</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-canvas/85 hover:text-canvas">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-[0.7rem] font-medium tracking-[0.18em] text-canvas/60 uppercase">Company</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li><Link href="/gallery" className="text-canvas/85 hover:text-canvas">Our Work</Link></li>
            <li><Link href="/about" className="text-canvas/85 hover:text-canvas">About</Link></li>
            <li><Link href="/contact" className="text-canvas/85 hover:text-canvas">Request an Estimate</Link></li>
            <li><Link href="/privacy" className="text-canvas/85 hover:text-canvas">Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-sans text-[0.7rem] font-medium tracking-[0.18em] text-canvas/60 uppercase">Materials showroom</h2>
          <p className="mt-5 text-sm leading-relaxed text-canvas/85">
            {site.showroom.operator}
            <br />
            {site.showroom.street}, {site.showroom.city}, {site.showroom.state}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-canvas/60">
            Operated by {site.showroom.operator}, a separate business. Construction and installation by {site.name}
          </p>
        </div>
      </div>
      <div className="border-t border-canvas/10">
        <p className="container-page py-6 text-xs text-canvas/50">© {site.name} All rights reserved.</p>
      </div>
    </footer>
  );
}
