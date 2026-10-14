import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { PhotosComingSoon } from "@/components/PhotosComingSoon";
import { ProjectGallery } from "@/components/ProjectGallery";
import { getGalleryProjects, projectCategories, type ProjectCategory } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Our Work: Kitchen & Bathroom Remodels",
  description: `Selected kitchen and bathroom remodels completed by ${site.name}, licensed California general contractor CSLB #${site.licenseNumber}, serving Garden Grove and nearby Orange County cities.`,
  path: "/gallery",
});

/** Kitchens and bathrooms always appear; other categories appear once they have photos. */
const ALWAYS_SHOWN: ProjectCategory[] = ["kitchens", "bathrooms"];

export default function GalleryPage() {
  const sections = (Object.keys(projectCategories) as ProjectCategory[])
    .map((c) => ({ category: c, projects: getGalleryProjects(c) }))
    .filter(({ category, projects }) => ALWAYS_SHOWN.includes(category) || projects.length > 0);

  return (
    <>
      <PageHeader crumbs={[{ name: "Our Work", href: "/gallery" }]} title="Our work">
        <p>Selected projects completed by our team.</p>
      </PageHeader>

      <nav aria-label="Gallery sections" className="sticky top-16 z-30 border-y border-line bg-canvas md:top-[4.75rem]">
        <ul className="container-page flex gap-8 overflow-x-auto py-3.5 text-sm">
          {sections.map(({ category, projects }) => (
            <li key={category}>
              <Link href={`#${category}`} className="whitespace-nowrap text-ink-soft hover:text-ink">
                {projectCategories[category].label}
                <span className="ml-1.5 text-xs text-ink-soft/80 tabular-nums">{projects.length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-page space-y-16 py-12 md:space-y-24 md:py-20">
        {sections.map(({ category, projects }) => (
          <section key={category} id={category} aria-labelledby={`${category}-heading`}>
            <h2 id={`${category}-heading`} className="type-h2 mb-8 md:mb-12">
              {projectCategories[category].label}
            </h2>
            {projects.length > 0 ? (
              <ProjectGallery projects={projects} label={`${projectCategories[category].label} projects`} />
            ) : (
              <PhotosComingSoon what={projectCategories[category].label.replace(/s$/, "")} />
            )}
          </section>
        ))}
      </div>

      <CtaBand heading="Planning something similar?" />
    </>
  );
}
