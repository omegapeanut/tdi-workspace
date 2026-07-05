// Generates public/sitemap.xml and public/robots.txt at build time.
// Static routes are hand-listed below; dynamic journal articles are pulled
// live from Firestore (public read) so new/removed posts stay in sync
// without any manual sitemap editing.
//
// Runs as part of `npm run build` (see package.json `prebuild`). Needs the
// same NEXT_PUBLIC_FIREBASE_* values Next uses — loaded from .env.local for
// local builds, or already present in the environment in CI.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

function loadDotEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2].trim();
  }
}
loadDotEnvLocal();

const SITE_URL = "https://omegapeanut.github.io/tdi-workspace";

const STATIC_ROUTES = ["/", "/projects", "/services", "/process", "/journal", "/materials", "/about", "/calculator", "/contact"];

const app = initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
});
const db = getFirestore(app);

const LIVE_STATUSES = ["Published", "Featured"];

async function getLiveArticleSlugs() {
  try {
    const snap = await getDocs(collection(db, "articles"));
    return snap.docs.map((d) => d.data()).filter((a) => LIVE_STATUSES.includes(a.status) && a.slug).map((a) => `/journal/view/?slug=${a.slug}`);
  } catch (err) {
    console.warn("generate-sitemap: could not read articles from Firestore, skipping dynamic URLs:", err.message);
    return [];
  }
}

// next.config.js sets trailingSlash: true, and GitHub Pages 301-redirects the
// bare path to its trailing-slash form — so the sitemap lists the canonical
// (redirect-free) URL directly rather than sending crawlers through a hop.
const articleUrls = await getLiveArticleSlugs();
const staticUrls = STATIC_ROUTES.map((path) => (path === "/" ? "/" : `${path}/`));
const urls = [...staticUrls, ...articleUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(join(process.cwd(), "public", "sitemap.xml"), xml);
console.log(`Wrote public/sitemap.xml with ${urls.length} URLs (${articleUrls.length} dynamic).`);

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE_URL}/sitemap.xml
`;
writeFileSync(join(process.cwd(), "public", "robots.txt"), robots);
console.log("Wrote public/robots.txt.");
