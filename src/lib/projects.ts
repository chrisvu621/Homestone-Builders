import generated from "@/generated/project-photos.json";

/**
 * Project photos live in public/projects/<category>/. A build step
 * (scripts/generate-photo-manifest.mjs) lists them into
 * src/generated/project-photos.json, so pages are fully static.
 *
 * The site never substitutes stock or generated imagery for completed work:
 * if a folder is empty, pages show an honest "photos coming soon" state.
 *
 * Optional: public/projects/photos.json can override alt text, mark a photo
 * as featured (used for the homepage hero), or hide a photo. See
 * public/projects/README.md.
 */

export const projectCategories = {
  kitchens: { label: "Kitchens", singular: "kitchen remodel" },
  bathrooms: { label: "Bathrooms", singular: "bathroom remodel" },
  adus: { label: "ADUs", singular: "ADU project" },
  "new-homes": { label: "New homes", singular: "new home project" },
  "windows-doors": { label: "Windows & doors", singular: "window and door project" },
  "shower-doors": { label: "Shower doors", singular: "shower door installation" },
} as const;

export type ProjectCategory = keyof typeof projectCategories;

export type ProjectPhoto = {
  src: string;
  alt: string;
  category: ProjectCategory;
  featured: boolean;
};

type GeneratedEntry = { file: string; alt?: string; featured?: boolean; hidden?: boolean };

const manifest = generated as Record<string, GeneratedEntry[] | undefined>;

function listCategory(category: ProjectCategory): ProjectPhoto[] {
  const { singular } = projectCategories[category];
  return (manifest[category] ?? [])
    .filter((e) => !e.hidden)
    .map((e, i) => ({
      src: `/projects/${category}/${encodeURIComponent(e.file)}`,
      alt: e.alt || `Completed ${singular} by Homestone Builders, photo ${i + 1}`,
      category,
      featured: Boolean(e.featured),
    }));
}

const allPhotos = Object.fromEntries(
  (Object.keys(projectCategories) as ProjectCategory[]).map((c) => [c, listCategory(c)]),
) as Record<ProjectCategory, ProjectPhoto[]>;

export function getProjectPhotos(): Record<ProjectCategory, ProjectPhoto[]> {
  return allPhotos;
}

/** Featured photo for the homepage hero: an explicit "featured" photo, else the first kitchen, else the first bathroom. */
export function pickHeroPhoto(all: Record<ProjectCategory, ProjectPhoto[]>): ProjectPhoto | undefined {
  return Object.values(all).flat().find((p) => p.featured) ?? all.kitchens[0] ?? all.bathrooms[0];
}
