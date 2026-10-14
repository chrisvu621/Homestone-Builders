import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { ArrowRight } from "@/components/Icons";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";
import { primaryCitiesText, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Remodeling & Construction Services in Orange County",
  description: `Kitchen and bathroom remodeling, ADUs, new home construction, windows, doors and shower doors from ${site.name}, licensed California general contractor CSLB #${site.licenseNumber}.`,
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Services", href: "/services" }]} eyebrow="Services" title="What we build">
        <p>Remodeling, new construction and installation for homeowners in {primaryCitiesText}.</p>
      </PageHeader>
      <section className="container-page pb-16 md:pb-24">
        <ul className="border-t border-ink">
          {services.map((s, i) => (
            <li key={s.slug} className="border-b border-line">
              <Link href={`/services/${s.slug}`} className="group grid gap-2 py-7 md:grid-cols-[3rem_1fr_1.3fr_auto] md:items-center md:gap-8 md:py-9">
                <span className="text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-[2rem] leading-tight md:text-[2.6rem]">{s.name}</span>
                <span className="text-ink-soft">{s.summary}</span>
                <ArrowRight className="hidden h-5 w-5 text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-ink md:block" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
