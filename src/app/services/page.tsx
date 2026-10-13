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
        <p>
          {site.name} performs remodeling, new construction and installation work for homeowners in {primaryCitiesText}.
        </p>
      </PageHeader>
      <section className="container-page py-14 md:py-20">
        <ul className="grid gap-5 md:grid-cols-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-xl border border-stone-line bg-white p-7 transition-shadow hover:shadow-lg"
              >
                <h2 className="text-2xl font-semibold">{s.name}</h2>
                <p className="mt-3 flex-1 text-ink-soft leading-relaxed">{s.summary}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-clay">
                  {s.name} details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
