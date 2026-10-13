import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { ArrowRight, Chat, Hammer, PhoneIcon, ShieldDoc, Store } from "@/components/Icons";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PhotosComingSoon } from "@/components/PhotosComingSoon";
import { ShowroomCard } from "@/components/ShowroomCard";
import { getProjectPhotos, pickHeroPhoto } from "@/lib/projects";
import { services } from "@/lib/services";
import { primaryCitiesText, site } from "@/lib/site";

export default function HomePage() {
  const photos = getProjectPhotos();
  const hero = pickHeroPhoto(photos);
  // Up to 6 kitchen and bathroom photos (an even count keeps the 2- and 3-column grids tidy).
  const pool = [...photos.kitchens.slice(0, 4), ...photos.bathrooms.slice(0, 4)].filter((p) => p.src !== hero?.src);
  const recent = pool.length >= 6 ? pool.slice(0, 6) : pool.slice(0, pool.length > 1 ? pool.length - (pool.length % 2) : pool.length);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden stone-surface text-ivory">
        {hero && (
          <>
            <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="-z-10 object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/55 to-black/30 md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-black/10" />
          </>
        )}
        <div className="container-page flex min-h-[78svh] flex-col justify-end py-14 md:min-h-[640px] md:justify-center md:py-24">
          <div className="max-w-2xl space-y-6">
            <p className="eyebrow !text-clay-light">Licensed General Contractor · CSLB #{site.licenseNumber}</p>
            <h1 className="text-4xl leading-[1.05] font-semibold sm:text-5xl md:text-6xl">
              Thoughtful kitchens, baths and ADUs for Orange County homes.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-sand md:text-xl">
              Homestone Builders handles the construction and installation of your remodel or new build, from first
              conversation to final finish, for homeowners in {primaryCitiesText}.
            </p>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link href="/contact" className="btn btn-primary">
                Request an Estimate <ArrowRight />
              </Link>
              <a href={site.phone.href} className="btn btn-outline border-sand/60 text-ivory">
                <PhoneIcon /> Call {site.phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-page py-16 md:py-24" aria-labelledby="services-heading">
        <div className="max-w-2xl space-y-3">
          <p className="eyebrow">What we build</p>
          <h2 id="services-heading" className="text-3xl font-semibold md:text-4xl">
            Remodeling and construction services
          </h2>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-xl border border-stone-line bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold">{s.name}</h3>
                <p className="mt-2 flex-1 text-ink-soft leading-relaxed">{s.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-clay">
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent work */}
      <section className="bg-sand/60 py-16 md:py-24" aria-labelledby="work-heading">
        <div className="container-page">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl space-y-3">
              <p className="eyebrow">Our work</p>
              <h2 id="work-heading" className="text-3xl font-semibold md:text-4xl">
                Kitchens and bathrooms we&apos;ve built
              </h2>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-1.5 font-semibold text-clay">
              View the full gallery <ArrowRight />
            </Link>
          </div>
          <div className="mt-10">
            {recent.length > 0 ? (
              <PhotoGallery photos={recent} label="Recent project photos" />
            ) : (
              <PhotosComingSoon what="Project" />
            )}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="container-page py-16 md:py-24" aria-labelledby="trust-heading">
        <div className="max-w-2xl space-y-3">
          <p className="eyebrow">Why homeowners call us</p>
          <h2 id="trust-heading" className="text-3xl font-semibold md:text-4xl">
            Straightforward, local and licensed
          </h2>
        </div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <li className="space-y-3">
            <ShieldDoc className="h-8 w-8 text-clay" />
            <h3 className="text-lg font-semibold">California licensed</h3>
            <p className="text-ink-soft leading-relaxed">
              CSLB License #{site.licenseNumber}.{" "}
              <a href={site.licenseLookupUrl} target="_blank" rel="noopener noreferrer" className="text-clay underline underline-offset-4">
                Look it up on the CSLB website<span className="sr-only"> (opens in a new tab)</span>
              </a>
              .
            </p>
          </li>
          <li className="space-y-3">
            <Hammer className="h-8 w-8 text-clay" />
            <h3 className="text-lg font-semibold">One contractor for the build</h3>
            <p className="text-ink-soft leading-relaxed">
              We perform the construction and installation, so you have one point of contact for the work.
            </p>
          </li>
          <li className="space-y-3">
            <Store className="h-8 w-8 text-clay" />
            <h3 className="text-lg font-semibold">See materials in person</h3>
            <p className="text-ink-soft leading-relaxed">
              Browse materials at the Garden Grove showroom operated by {site.showroom.operator}.
            </p>
          </li>
          <li className="space-y-3">
            <Chat className="h-8 w-8 text-clay" />
            <h3 className="text-lg font-semibold">Talk to us directly</h3>
            <p className="text-ink-soft leading-relaxed">
              Call <a href={site.phone.href} className="font-semibold text-ink">{site.phone.display}</a> or send a request
              online, and we&apos;ll follow up about your project.
            </p>
          </li>
        </ul>
      </section>

      {/* Service area + showroom */}
      <section className="border-t border-stone-line py-16 md:py-24" aria-labelledby="area-heading">
        <div className="container-page grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <p className="eyebrow">Service area</p>
            <h2 id="area-heading" className="text-3xl font-semibold md:text-4xl">
              Serving central and west Orange County
            </h2>
            <p className="text-lg text-ink-soft leading-relaxed">Our primary service cities:</p>
            <ul className="flex flex-wrap gap-2">
              {site.primaryCities.map((c) => (
                <li key={c} className="rounded-full border border-stone-line bg-white px-4 py-2 text-sm font-medium">
                  {c}
                </li>
              ))}
            </ul>
            <p className="text-ink-soft leading-relaxed">
              Elsewhere in Orange County? We take projects in other cities on a project-by-project basis. Tell us where
              you are and what you&apos;re planning.
            </p>
          </div>
          <ShowroomCard />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
