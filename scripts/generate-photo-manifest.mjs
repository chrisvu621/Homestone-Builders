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

/** EXIF orientation (1–8) from a JPEG APP1 segment, or 1. */
function jpegOrientation(buf, start, length) {
  if (buf.toString("ascii", start, start + 4) !== "Exif") return 1;
  const tiff = start + 6;
  const le = buf.toString("ascii", tiff, tiff + 2) === "II";
  const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
  const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
  const ifd = tiff + u32(tiff + 4);
  if (ifd + 2 > start + length) return 1;
  const count = u16(ifd);
  for (let i = 0; i < count; i++) {
    const entry = ifd + 2 + i * 12;
    if (entry + 12 > start + length) break;
    if (u16(entry) === 0x0112) return u16(entry + 8);
  }
  return 1;
}

/** Display dimensions (after EXIF rotation) for JPEG and PNG files; undefined for other formats. */
function imageSize(buf) {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xd8) return undefined;
  let offset = 2;
  let orientation = 1;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return undefined;
    const marker = buf[offset + 1];
    const length = buf.readUInt16BE(offset + 2);
    if (marker === 0xe1) orientation = jpegOrientation(buf, offset + 4, length - 2);
    const isSof = marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isSof) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return orientation >= 5 ? { width: height, height: width } : { width, height };
    }
    offset += 2 + length;
  }
  return undefined;
}

let manifest = {};
try {
  manifest = JSON.parse(await readFile(path.join(projectsDir, "photos.json"), "utf8"));
} catch (err) {
  if (err.code !== "ENOENT") {
    console.error(`[photos] Could not parse public/projects/photos.json: ${err.message}`);
    process.exit(1);
  }
}

const str = (v) => (typeof v === "string" && v.trim() ? v.trim() : undefined);

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
  categories[category] = [];
  for (const file of files) {
    const meta = manifest[`${category}/${file}`] ?? {};
    const size = imageSize(await readFile(path.join(projectsDir, category, file)));
    categories[category].push({
      file,
      ...(size ?? {}),
      ...(str(meta.alt) ? { alt: str(meta.alt) } : {}),
      ...(str(meta.project) ? { project: str(meta.project) } : {}),
      ...(str(meta.title) ? { title: str(meta.title) } : {}),
      ...(meta.featured ? { featured: true } : {}),
      ...(meta.hidden ? { hidden: true } : {}),
      ...(Array.isArray(meta.also) && meta.also.length ? { also: meta.also.filter((c) => typeof c === "string") } : {}),
    });
  }
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
