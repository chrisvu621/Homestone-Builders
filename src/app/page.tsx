import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { ArrowRight } from "@/components/Icons";
import { PhotosComingSoon } from "@/components/PhotosComingSoon";
import { ShowroomCard } from "@/components/ShowroomCard";
import { getGalleryProjects, getHeroPhoto, type Project } from "@/lib/projects";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

/** Pick up to two kitchens and two bathrooms, skipping the project used in the hero. */
function selectedProjects(heroProjectId?: string) {
  const pick = (list: Project[]) => list.filter((p) => p.id !== heroProjectId).slice(0, 2);
  const kitchens = pick(getGalleryProjects("kitchens"));
  const bathrooms = pick(getGalleryProjects("bathrooms"));
  // Alternate wide (kitchen) and narrow (bathroom) tiles: K B / B K.
  return [kitchens[0], bathrooms[0], bathrooms[1], kitchens[1]].filter(Boolean) as Project[];
}

export default function HomePage() {
  const hero = getHeroPhoto();
  const selected = selectedProjects(hero?.project.id);

  return (
    <>
      {/* Hero: photo first. On mobile the copy sits below the photo; on desktop it overlays the lower-left corner. */}
      <section className="relative lg:h-[calc(100svh-4.75rem)] lg:max-h-[56rem] lg:min-h-[36rem]">
        <div className="relative h-[44svh] min-h-[16rem] bg-sand lg:absolute lg:inset-0 lg:h-auto">
          {hero ? (
            <Image
              src={hero.photo.src}
              alt={hero.photo.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
          {hero && (
            <div className="absolute inset-0 hidden bg-gradient-to-t from-black/75 via-black/30 via-55% to-transparent lg:block" />
          )}
        </div>
        <div className="container-page relative pt-6 pb-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:pb-16 lg:text-canvas">
          <div className="max-w-2xl">
            <p className="eyebrow mb-3 lg:mb-0 lg:text-canvas/85!">CSLB License #{site.licenseNumber}</p>
            <h1 className="type-hero lg:mt-4">
              Beautiful spaces. Thoughtfully built.
            </h1>
            <p className="mt-3 max-w-md text-[0.95rem] leading-relaxed text-ink-soft lg:mt-5 lg:max-w-lg lg:text-lg lg:text-canvas/90">
              A licensed Orange County general contractor specializing in kitchens, bathrooms, ADUs, and home improvements.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:gap-3 lg:mt-8">
              <Link href="/gallery" className="btn btn-primary px-3 text-sm sm:px-6 sm:text-[0.95rem] lg:btn-light">
                Explore Our Work
              </Link>
              <Link href="/contact" className="btn btn-outline px-3 text-sm text-ink sm:px-6 sm:text-[0.95rem] lg:text-canvas">
                Request an Estimate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="container-page py-14 md:py-24" aria-labelledby="work-heading">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="work-heading" className="type-h2 mt-3">
              Kitchens &amp; bathrooms
            </h2>
          </div>
          <Link href="/gallery" className="link-quiet inline-flex items-center gap-2 self-start text-sm md:self-auto">
            View all projects <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {selected.length > 0 ? (
          <ul className="mt-10 grid gap-x-8 gap-y-12 md:mt-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
            {selected.map((project, i) => {
              const photo = project.photos[0];
              const wide = i === 0 || i === 3;
              const ratio = photo.width && photo.height ? photo.width / photo.height : 4 / 3;
              return (
                <li key={project.id} className={wide ? "lg:col-span-8" : "lg:col-span-4"}>
                  <Link href={`/gallery#${project.id}`} className="group block">
                    <div
                      className="relative overflow-hidden bg-sand lg:h-[34rem] lg:aspect-auto!"
                      style={{ aspectRatio: String(Math.max(ratio, 0.8)) }}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes={wide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-4">
                      <h3 className="type-caption font-normal">{project.title}</h3>
                      <span className="shrink-0 text-xs tracking-[0.14em] text-ink-soft uppercase">{project.kind}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-10">
            <PhotosComingSoon what="Project" />
          </div>
        )}
      </section>

      {/* Services */}
      <section className="border-t border-line" aria-labelledby="services-heading">
        <div className="container-page grid gap-10 py-14 md:py-24 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <p className="eyebrow">Services</p>
            <h2 id="services-heading" className="type-h2 mt-3">
              What we build
            </h2>
          </div>
          <ul className="border-t border-line">
            {services.map((s, i) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={`/services/${s.slug}`} className="group flex items-center gap-5 py-5 md:gap-8 md:py-6">
                  <span className="w-6 text-xs text-accent tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1">
                    <span className="type-h3 block">{s.name}</span>
                    <span className="mt-1 hidden text-sm text-ink-soft md:block">{s.summary}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 text-ink-soft transition-transform group-hover:translate-x-1 group-hover:text-ink" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Facts, service area and showroom */}
      <section className="border-t border-line" aria-labelledby="area-heading">
        <div className="container-page grid gap-12 py-14 md:py-24 lg:grid-cols-3 lg:gap-16">
          <div className="space-y-3 border-t border-ink pt-6">
            <p className="eyebrow">Licensed</p>
            <p className="type-h3">CSLB #{site.licenseNumber}</p>
            <p className="text-sm leading-relaxed text-ink-soft">
              California general contractor.{" "}
              <a href={site.licenseLookupUrl} target="_blank" rel="noopener noreferrer" className="link-quiet text-ink">
                Look up the license<span className="sr-only"> on the CSLB website (opens in a new tab)</span>
              </a>
            </p>
          </div>
          <div className="space-y-3 border-t border-ink pt-6">
            <p className="eyebrow" id="area-heading">Where we work</p>
            <p className="type-h3">Orange County</p>
            <p className="text-sm leading-relaxed text-ink-soft">
              Primary service cities: {site.primaryCities.join(", ")}. Other Orange County cities on a
              project-by-project basis.
            </p>
          </div>
          <ShowroomCard compact />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
