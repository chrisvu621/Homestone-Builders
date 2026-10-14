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
 * as featured (used for the homepage hero), hide a photo, or also show it on
 * another category's service page (e.g. a bathroom photo with a glass shower
 * door listed under "shower-doors"). See
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
  /** The folder the photo lives in. Cross-listed photos keep their home category. */
  category: ProjectCategory;
  featured: boolean;
};

type GeneratedEntry = { file: string; alt?: string; featured?: boolean; hidden?: boolean; also?: string[] };

const manifest = generated as Record<string, GeneratedEntry[] | undefined>;

type Listed = { photo: ProjectPhoto; also: ProjectCategory[] };

function listCategory(category: ProjectCategory): Listed[] {
  const { singular } = projectCategories[category];
  return (manifest[category] ?? [])
    .filter((e) => !e.hidden)
    .map((e, i) => ({
      photo: {
        src: `/projects/${category}/${encodeURIComponent(e.file)}`,
        alt: e.alt || `Completed ${singular} by Homestone Builders, photo ${i + 1}`,
        category,
        featured: Boolean(e.featured),
      },
      also: (e.also ?? []).filter((c): c is ProjectCategory => c in projectCategories && c !== category),
    }));
}

const categoryKeys = Object.keys(projectCategories) as ProjectCategory[];
const listed = Object.fromEntries(categoryKeys.map((c) => [c, listCategory(c)])) as Record<ProjectCategory, Listed[]>;

/** Photos stored in each folder (used by the gallery, so nothing appears twice). */
const ownPhotos = Object.fromEntries(categoryKeys.map((c) => [c, listed[c].map((x) => x.photo)])) as Record<
  ProjectCategory,
  ProjectPhoto[]
>;

/** Each category's own photos plus photos cross-listed into it (used by service pages). */
const allPhotos = Object.fromEntries(
  categoryKeys.map((c) => [
    c,
    [
      ...ownPhotos[c],
      ...categoryKeys.flatMap((other) => listed[other].filter((x) => x.also.includes(c)).map((x) => x.photo)),
    ],
  ]),
) as Record<ProjectCategory, ProjectPhoto[]>;

export function getGalleryPhotos(): Record<ProjectCategory, ProjectPhoto[]> {
  return ownPhotos;
}

export function getProjectPhotos(): Record<ProjectCategory, ProjectPhoto[]> {
  return allPhotos;
}

/** Featured photo for the homepage hero: an explicit "featured" photo, else the first kitchen, else the first bathroom. */
export function pickHeroPhoto(all: Record<ProjectCategory, ProjectPhoto[]>): ProjectPhoto | undefined {
  return Object.values(all).flat().find((p) => p.featured) ?? all.kitchens[0] ?? all.bathrooms[0];
}
