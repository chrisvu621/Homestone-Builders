import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PhotosComingSoon } from "@/components/PhotosComingSoon";
import { getGalleryPhotos, projectCategories, type ProjectCategory } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Project Gallery: Kitchen & Bathroom Remodels",
  description: `Photos of kitchen and bathroom remodels completed by ${site.name}, licensed California general contractor CSLB #${site.licenseNumber}, serving Garden Grove and nearby Orange County cities.`,
  path: "/gallery",
});

/** Kitchens and bathrooms always appear; other categories appear once they have photos. */
const ALWAYS_SHOWN: ProjectCategory[] = ["kitchens", "bathrooms"];

export default function GalleryPage() {
  const photos = getGalleryPhotos();
  const sections = (Object.keys(projectCategories) as ProjectCategory[]).filter(
    (c) => ALWAYS_SHOWN.includes(c) || photos[c].length > 0,
  );

  return (
    <>
      <PageHeader crumbs={[{ name: "Gallery", href: "/gallery" }]} eyebrow="Project gallery" title="Our completed work">
        <p>Every photo here is from a project built by {site.name}. Tap any photo to see it larger.</p>
      </PageHeader>

      <nav aria-label="Gallery sections" className="sticky top-16 z-30 border-b border-stone-line bg-ivory/95 backdrop-blur md:top-20">
        <ul className="container-page flex gap-2 overflow-x-auto py-3">
          {sections.map((c) => (
            <li key={c}>
              <Link href={`#${c}`} className="inline-block whitespace-nowrap rounded-full border border-stone-line bg-white px-4 py-2 text-sm font-medium hover:border-clay hover:text-clay">
                {projectCategories[c].label}
                <span className="ml-1.5 text-ink-soft">({photos[c].length})</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page space-y-16 py-14 md:space-y-20 md:py-20">
        {sections.map((c) => (
          <section key={c} id={c} aria-labelledby={`${c}-heading`} className="space-y-6">
            <h2 id={`${c}-heading`} className="text-3xl font-semibold">
              {projectCategories[c].label}
            </h2>
            {photos[c].length > 0 ? (
              <PhotoGallery photos={photos[c]} label={`${projectCategories[c].label} photos`} />
            ) : (
              <PhotosComingSoon what={projectCategories[c].label.replace(/s$/, "")} />
            )}
          </section>
        ))}
      </div>

      <CtaBand heading="Like what you see?" />
    </>
  );
}
