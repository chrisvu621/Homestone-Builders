import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { ArrowRight, Check, PhoneIcon } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PhotosComingSoon } from "@/components/PhotosComingSoon";
import { ShowroomCard } from "@/components/ShowroomCard";
import { getProjectPhotos, projectCategories } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { getService, services } from "@/lib/services";
import { getSiteUrl, primaryCitiesText, site } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({ title: service.seoTitle, description: service.seoDescription, path: `/services/${slug}` });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const allPhotos = getProjectPhotos();
  const photos = service.photoCategory ? allPhotos[service.photoCategory] : [];
  const others = services.filter((s) => s.slug !== service.slug);
  const showMaterials = ["kitchen-remodeling", "bathroom-remodeling"].includes(service.slug);
  const url = getSiteUrl();

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
        eyebrow={`Licensed general contractor · CSLB #${site.licenseNumber}`}
        title={service.heading}
      >
        <p>{service.summary}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={`/contact?service=${encodeURIComponent(service.label)}`} className="btn btn-primary">
            Request an Estimate <ArrowRight />
          </Link>
          <a href={site.phone.href} className="btn btn-outline text-ink">
            <PhoneIcon /> {site.phone.display}
          </a>
        </div>
      </PageHeader>

      <section className="container-page grid gap-12 py-14 md:py-20 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div className="prose-page">
          {service.intro.map((p) => (
            <p key={p.slice(0, 32)} className="text-lg">{p}</p>
          ))}
          <h2>{service.scopeHeading}</h2>
          <ul className="!list-none !pl-0">
            {service.scope.map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="mt-1 h-5 w-5 shrink-0 text-clay" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm">Every project is scoped individually. We&apos;ll confirm exactly what&apos;s included in yours.</p>
        </div>
        <aside className="h-fit rounded-xl border border-stone-line bg-white p-6 md:p-8">
          <h2 className="text-xl font-semibold">{service.planningHeading}</h2>
          <ul className="mt-4 space-y-3 text-ink-soft leading-relaxed">
            {service.planning.map((q) => (
              <li key={q} className="border-l-2 border-clay-light pl-3">{q}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-soft">
            Serving {primaryCitiesText}. Other Orange County cities on a project-by-project basis.
          </p>
        </aside>
      </section>

      {service.photoCategory && (
        <section className="bg-sand/60 py-14 md:py-20" aria-labelledby="photos-heading">
          <div className="container-page space-y-8">
            <h2 id="photos-heading" className="text-3xl font-semibold">
              {projectCategories[service.photoCategory].label} we&apos;ve completed
            </h2>
            {photos.length > 0 ? (
              <PhotoGallery photos={photos} limit={6} label={`${service.name} project photos`} />
            ) : (
              <PhotosComingSoon what={projectCategories[service.photoCategory].label.replace(/s$/, "")} />
            )}
            {photos.length > 6 && (
              <Link href={`/gallery#${service.photoCategory}`} className="inline-flex items-center gap-1.5 font-semibold text-clay">
                See all {photos.length} photos <ArrowRight />
              </Link>
            )}
          </div>
        </section>
      )}

      {showMaterials && (
        <section className="container-page py-14 md:py-20">
          <ShowroomCard />
        </section>
      )}

      <section className="container-page border-t border-stone-line py-14" aria-labelledby="other-heading">
        <h2 id="other-heading" className="text-2xl font-semibold">Other services</h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {others.map((s) => (
            <li key={s.slug}>
              <Link href={`/services/${s.slug}`} className="inline-block rounded-full border border-stone-line bg-white px-4 py-2.5 font-medium hover:border-clay hover:text-clay">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBand />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          serviceType: service.name,
          description: service.seoDescription,
          url: `${url}/services/${service.slug}`,
          provider: { "@id": `${url}/#business` },
          areaServed: site.primaryCities.map((c) => ({ "@type": "City", name: `${c}, CA` })),
        }}
      />
    </>
  );
}
