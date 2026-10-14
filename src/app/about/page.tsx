import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { findPhoto } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/lib/services";
import { primaryCitiesText, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Homestone Builders Inc.",
  description: `${site.name} is a licensed California general contractor (CSLB #${site.licenseNumber}) serving ${primaryCitiesText}. Call ${site.phone.display}.`,
  path: "/about",
});

export default function AboutPage() {
  const photo = findPhoto("kitchens/kitchen-03.jpg") ?? findPhoto("kitchens/kitchen-01.jpg");
  const facts: [string, React.ReactNode][] = [
    ["Company", site.name],
    ["License", <>California CSLB #{site.licenseNumber}</>],
    [
      "Phone",
      <a key="p" href={site.phone.href} className="link-quiet tabular-nums">
        {site.phone.display}
      </a>,
    ],
    ["Service area", "Orange County, California"],
  ];

  return (
    <>
      <PageHeader crumbs={[{ name: "About", href: "/about" }]} eyebrow="About" title={site.name}>
        <p>A licensed California general contractor building and remodeling homes in Orange County.</p>
      </PageHeader>

      {photo && (
        <div className="container-page">
          <div className="relative aspect-[4/3] overflow-hidden bg-sand md:aspect-[21/9]">
            <Image src={photo.photo.src} alt={photo.photo.alt} fill priority sizes="100vw" className="object-cover" />
          </div>
        </div>
      )}

      <section className="container-page grid gap-14 py-14 md:py-24 lg:grid-cols-[1.5fr_1fr] lg:gap-24">
        <div className="prose-page">
          <h2 className="!mt-0">Who we are</h2>
          <p>
            {site.name} is a general contractor licensed by the California Contractors State License Board, license
            number {site.licenseNumber}. We perform construction and installation for residential projects:{" "}
            {services.map((s, i) => (
              <span key={s.slug}>
                <Link href={`/services/${s.slug}`}>{s.name.toLowerCase()}</Link>
                {i < services.length - 2 ? ", " : i === services.length - 2 ? " and " : "."}
              </span>
            ))}
          </p>
          <h2>Where we work</h2>
          <p>
            Our primary service cities are {primaryCitiesText}. We also take on projects in other Orange County cities
            on a project-by-project basis.
          </p>
          <h2>Materials showroom</h2>
          <p>
            Homeowners can see materials in person at the showroom at {site.showroom.street}, {site.showroom.city}. That
            showroom is owned and operated by <strong>{site.showroom.operator}</strong>, a separate materials business.{" "}
            {site.name} is the licensed contractor that performs the construction and installation.
          </p>
        </div>

        <aside className="h-fit">
          <dl className="border-t border-ink">
            {facts.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-line py-4 text-sm">
                <dt className="text-ink-soft">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-ink-soft">
            Check any California contractor license on the{" "}
            <a href={site.licenseLookupUrl} target="_blank" rel="noopener noreferrer" className="link-quiet text-ink">
              CSLB license lookup<span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </aside>
      </section>

      <CtaBand />
    </>
  );
}
