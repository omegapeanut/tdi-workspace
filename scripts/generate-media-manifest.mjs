// Generates public/media-manifest.json — a list of images actually shipped in
// public/images, so the admin Media library can show what's really on the site
// (the app serves local static images, not a Cloudinary library, despite the
// original README brief assuming Cloudinary was wired up).

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "public", "images");
const files = readdirSync(dir)
  .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
  .map((f) => ({ name: f, path: `/images/${f}`, size: statSync(join(dir, f)).size }))
  .sort((a, b) => a.name.localeCompare(b.name));

writeFileSync(join(process.cwd(), "public", "media-manifest.json"), JSON.stringify(files, null, 2));
console.log(`Wrote ${files.length} entries to public/media-manifest.json`);
