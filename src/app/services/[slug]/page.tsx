import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { PhotosComingSoon } from "@/components/PhotosComingSoon";
import { ProjectGallery } from "@/components/ProjectGallery";
import { ShowroomCard } from "@/components/ShowroomCard";
import { findPhoto, getServiceProjects, projectCategories } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { getService, services } from "@/lib/services";
import { getSiteUrl, site } from "@/lib/site";

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

  const projects = service.photoCategory ? getServiceProjects(service.photoCategory) : [];
  const hero =
    (service.heroPhoto && findPhoto(service.heroPhoto)) ||
    (projects[0] ? { project: projects[0], photo: projects[0].photos[0] } : undefined);
  // A portrait lead photo is paired with a second portrait photo so neither is cropped into a wide banner.
  const isPortrait = (p: { width?: number; height?: number }) => Boolean(p.width && p.height && p.height > p.width);
  const heroPhotos = hero
    ? isPortrait(hero.photo)
      ? [
          hero,
          ...projects
            .flatMap((project) => project.photos.map((photo) => ({ project, photo })))
            .filter((x) => x.photo.src !== hero.photo.src && isPortrait(x.photo))
            .slice(0, 1),
        ]
      : [hero]
    : [];
  // Projects already shown at the top aren't repeated in the grid below.
  const heroSrcs = new Set(heroPhotos.map((h) => h.photo.src));
  const moreProjects = projects.filter((p) => !p.photos.every((ph) => heroSrcs.has(ph.src)));
  const others = services.filter((s) => s.slug !== service.slug);
  const showMaterials = ["kitchen-remodeling", "bathroom-remodeling"].includes(service.slug);
  const estimateHref = `/contact?service=${encodeURIComponent(service.label)}`;
  const url = getSiteUrl();

  const ctas = (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3 md:flex-col lg:flex-row">
      <Link href={estimateHref} className="btn btn-primary px-3 text-sm sm:px-6 sm:text-[0.92rem]">
        Request an Estimate
      </Link>
      <a href={site.phone.href} className="btn btn-outline px-3 text-sm text-ink tabular-nums sm:px-6 sm:text-[0.92rem]">
        Call {site.phone.display}
      </a>
    </div>
  );

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Services", href: "/services" },
          { name: service.name, href: `/services/${service.slug}` },
        ]}
        eyebrow={`CSLB #${site.licenseNumber}`}
        title={service.heading}
        aside={<div className="hidden md:block">{ctas}</div>}
      >
        <p>{service.intro}</p>
        <div className="mt-6 md:hidden">{ctas}</div>
      </PageHeader>

      {heroPhotos.length > 0 && (
        <div className={`container-page grid gap-2 md:gap-3 ${heroPhotos.length > 1 ? "grid-cols-2" : ""}`}>
          {heroPhotos.map(({ project, photo }, i) => (
            <figure key={photo.src} className={i > 0 ? "hidden sm:block" : heroPhotos.length > 1 ? "col-span-2 sm:col-span-1" : ""}>
              <div
                className={`relative overflow-hidden bg-sand ${
                  heroPhotos.length > 1 ? "aspect-[4/5] lg:aspect-[5/6]" : "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={i === 0}
                  sizes={heroPhotos.length > 1 ? "(min-width: 640px) 50vw, 100vw" : "100vw"}
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4 text-xs tracking-[0.14em] text-ink-soft uppercase">
                <span>{project.title}</span>
                <span className="hidden sm:inline">{project.kind}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      <section className="container-page grid gap-12 py-14 md:grid-cols-2 md:gap-16 md:py-20">
        <div>
          <h2 className="type-h3">{service.scopeHeading}</h2>
          <ul className="mt-6 border-t border-line">
            {service.scope.map((item) => (
              <li key={item} className="border-b border-line py-3.5 text-ink">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">Every project is scoped individually.</p>
          {service.materials && service.materials.length > 0 && (
            <>
              <h2 className="type-h3 mt-10">Materials we install</h2>
              <ul className="mt-6 border-t border-line">
                {service.materials.map((m) => (
                  <li key={m} className="border-b border-line py-3.5 text-ink">
                    {m}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div>
          <h2 className="type-h3">{service.planningHeading}</h2>
          <ul className="mt-6 border-t border-line">
            {service.planning.map((q) => (
              <li key={q} className="border-b border-line py-3.5 text-ink-soft">
                {q}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {service.photoCategory && (moreProjects.length > 0 || projects.length === 0) && (
        <section className="border-t border-line" aria-labelledby="photos-heading">
          <div className="container-page py-14 md:py-20">
            <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
              <h2 id="photos-heading" className="type-h2">
                {heroPhotos.length > 0
                  ? `More ${projectCategories[service.photoCategory].label.toLowerCase()}`
                  : projectCategories[service.photoCategory].label}
              </h2>
              <Link href="/gallery" className="link-quiet self-start text-sm md:self-auto">
                View all projects
              </Link>
            </div>
            {moreProjects.length > 0 ? (
              <ProjectGallery projects={moreProjects} label={`${service.name} projects`} />
            ) : (
              <PhotosComingSoon what={projectCategories[service.photoCategory].label.replace(/s$/, "")} />
            )}
          </div>
        </section>
      )}

      {showMaterials && (
        <section className="container-page pb-14 md:pb-20">
          <div className="max-w-xl">
            <ShowroomCard />
          </div>
        </section>
      )}

      <nav aria-labelledby="other-heading" className="border-t border-line">
        <div className="container-page py-12">
          <h2 id="other-heading" className="eyebrow font-sans">
            Other services
          </h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="link-quiet type-caption">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

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
