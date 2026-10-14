import generated from "@/generated/project-photos.json";

/**
 * Project photos live in public/projects/<category>/. A build step
 * (scripts/generate-photo-manifest.mjs) lists them, with their dimensions,
 * into src/generated/project-photos.json, so pages are fully static.
 *
 * The site never substitutes stock or generated imagery for completed work:
 * if a folder is empty, pages show an honest "photos coming soon" state.
 *
 * public/projects/photos.json can set alt text and a project title, group
 * several photos into one project ("project": "<id>"), mark the homepage hero
 * ("featured"), hide a photo, or also list a project on another service page
 * ("also": ["shower-doors"]). See public/projects/README.md.
 */

export const projectCategories = {
  kitchens: { label: "Kitchens", singular: "Kitchen remodel" },
  bathrooms: { label: "Bathrooms", singular: "Bathroom remodel" },
  adus: { label: "ADUs", singular: "ADU" },
  "new-homes": { label: "New homes", singular: "New home" },
  "windows-doors": { label: "Windows & doors", singular: "Windows and doors" },
  "shower-doors": { label: "Shower doors", singular: "Shower door installation" },
  flooring: { label: "Flooring", singular: "Flooring installation" },
} as const;

export type ProjectCategory = keyof typeof projectCategories;

export type ProjectPhoto = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  featured: boolean;
};

export type Project = {
  id: string;
  title: string;
  /** e.g. "Kitchen remodel" */
  kind: string;
  /** The folder the photos live in. Cross-listed projects keep their home category. */
  category: ProjectCategory;
  photos: ProjectPhoto[];
  also: ProjectCategory[];
};

type GeneratedEntry = {
  file: string;
  width?: number;
  height?: number;
  alt?: string;
  project?: string;
  title?: string;
  featured?: boolean;
  hidden?: boolean;
  also?: string[];
};

const manifest = generated as Record<string, GeneratedEntry[] | undefined>;
const categoryKeys = Object.keys(projectCategories) as ProjectCategory[];
const isCategory = (c: string): c is ProjectCategory => c in projectCategories;

function buildProjects(category: ProjectCategory): Project[] {
  const { singular } = projectCategories[category];
  const projects = new Map<string, Project>();
  for (const e of manifest[category] ?? []) {
    if (e.hidden) continue;
    const id = `${category}-${e.project ?? e.file.replace(/\.[^.]+$/, "")}`
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-");
    let project = projects.get(id);
    if (!project) {
      project = { id, title: "", kind: singular, category, photos: [], also: [] };
      projects.set(id, project);
    }
    if (!project.title && e.title) project.title = e.title;
    for (const c of e.also ?? []) if (isCategory(c) && c !== category && !project.also.includes(c)) project.also.push(c);
    project.photos.push({
      src: `/projects/${category}/${encodeURIComponent(e.file)}`,
      alt: e.alt || `${singular} by Homestone Builders`,
      width: e.width,
      height: e.height,
      featured: Boolean(e.featured),
    });
  }
  const list = [...projects.values()];
  list.forEach((p, i) => {
    if (!p.title) p.title = `${singular} ${i + 1}`;
  });
  return list;
}

const ownProjects = Object.fromEntries(categoryKeys.map((c) => [c, buildProjects(c)])) as Record<
  ProjectCategory,
  Project[]
>;

/** Projects stored in a folder (the gallery uses this, so nothing appears twice). */
export function getGalleryProjects(category: ProjectCategory): Project[] {
  return ownProjects[category];
}

/** A category's own projects plus projects cross-listed into it (used by service pages). */
export function getServiceProjects(category: ProjectCategory): Project[] {
  return [
    ...ownProjects[category],
    ...categoryKeys.flatMap((other) => ownProjects[other].filter((p) => p.also.includes(category))),
  ];
}

export function findPhoto(path: string): { project: Project; photo: ProjectPhoto } | undefined {
  for (const c of categoryKeys) {
    for (const project of ownProjects[c]) {
      const photo = project.photos.find((p) => decodeURIComponent(p.src) === `/projects/${path}`);
      if (photo) return { project, photo };
    }
  }
  return undefined;
}

/** Homepage hero: the photo marked "featured", else the first kitchen, else the first bathroom. */
export function getHeroPhoto(): { project: Project; photo: ProjectPhoto } | undefined {
  for (const c of categoryKeys) {
    for (const project of ownProjects[c]) {
      const photo = project.photos.find((p) => p.featured);
      if (photo) return { project, photo };
    }
  }
  const fallback = ownProjects.kitchens[0] ?? ownProjects.bathrooms[0];
  return fallback ? { project: fallback, photo: fallback.photos[0] } : undefined;
}

/** Aspect ratio (width / height) with a 4:3 fallback when dimensions are unknown. */
export function aspectOf(photo: ProjectPhoto): number {
  return photo.width && photo.height ? photo.width / photo.height : 4 / 3;
}
