// Scans public/projects/<category>/ and writes src/generated/project-photos.json.
// Runs automatically before `npm run dev`, `npm run build` and `npm run typecheck`,
// so pages never need filesystem access at request time.
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsDir = path.join(root, "public", "projects");
const outFile = path.join(root, "src", "generated", "project-photos.json");
const IMAGE_EXT = /\.(jpe?g|png|webp|avif)$/i;

let manifest = {};
try {
  manifest = JSON.parse(await readFile(path.join(projectsDir, "photos.json"), "utf8"));
} catch (err) {
  if (err.code !== "ENOENT") {
    console.error(`[photos] Could not parse public/projects/photos.json: ${err.message}`);
    process.exit(1);
  }
}

const categories = {};
let total = 0;
let dirs = [];
try {
  dirs = (await readdir(projectsDir, { withFileTypes: true })).filter((d) => d.isDirectory()).map((d) => d.name);
} catch {
  // No projects folder yet.
}
for (const category of dirs) {
  const files = (await readdir(path.join(projectsDir, category)))
    .filter((f) => IMAGE_EXT.test(f) && !f.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  categories[category] = files.map((file) => {
    const meta = manifest[`${category}/${file}`] ?? {};
    return {
      file,
      ...(typeof meta.alt === "string" && meta.alt.trim() ? { alt: meta.alt.trim() } : {}),
      ...(meta.featured ? { featured: true } : {}),
      ...(meta.hidden ? { hidden: true } : {}),
    };
  });
  total += files.length;
}

await mkdir(path.dirname(outFile), { recursive: true });
const json = JSON.stringify(categories, null, 2) + "\n";
let previous = "";
try {
  previous = await readFile(outFile, "utf8");
} catch {}
if (previous !== json) await writeFile(outFile, json);
console.log(`[photos] ${total} project photo(s) found in public/projects`);
