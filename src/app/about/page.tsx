import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { ShowroomCard } from "@/components/ShowroomCard";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";
import { primaryCitiesText, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Homestone Builders Inc.",
  description: `${site.name} is a licensed California general contractor (CSLB #${site.licenseNumber}) serving ${primaryCitiesText}. Call ${site.phone.display}.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "About", href: "/about" }]} eyebrow="About us" title={`About ${site.name}`}>
        <p>A licensed California general contractor building and remodeling homes in Orange County.</p>
      </PageHeader>

      <section className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div className="prose-page">
          <h2 className="!mt-0">Who we are</h2>
          <p>
            {site.name} is a general contractor licensed by the California Contractors State License Board under license
            number {site.licenseNumber}. We perform construction and installation work for residential projects,
            including:
          </p>
          <ul>
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`}>{s.name}</Link>
              </li>
            ))}
          </ul>

          <h2>Where we work</h2>
          <p>
            Our primary service cities are {primaryCitiesText}. We also take on projects in other Orange County cities
            on a project-by-project basis.
          </p>

          <h2>Our showroom partner</h2>
          <p>
            Homeowners can see materials in person at the showroom at {site.showroom.street}, {site.showroom.city}. That
            showroom is owned and operated by <strong>{site.showroom.operator}</strong>, a separate materials business.
            {" "}{site.name} is the licensed contractor that performs the construction and installation.
          </p>
        </div>

        <aside className="h-fit space-y-6">
          <dl className="divide-y divide-stone-line rounded-xl border border-stone-line bg-white">
            {[
              ["Company", site.name],
              ["License", `California CSLB #${site.licenseNumber}`],
              ["Phone", site.phone.display],
              ["Service area", "Orange County, California"],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 px-5 py-4 text-sm">
                <dt className="font-semibold text-ink-soft">{k}</dt>
                <dd>{k === "Phone" ? <a href={site.phone.href} className="font-semibold text-clay">{v}</a> : v}</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-ink-soft">
            You can check any California contractor license on the{" "}
            <a href={site.licenseLookupUrl} target="_blank" rel="noopener noreferrer" className="text-clay underline underline-offset-4">
              CSLB license lookup<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </aside>
      </section>

      <section className="container-page pb-16 md:pb-24">
        <ShowroomCard compact />
      </section>

      <CtaBand />
    </>
  );
}
