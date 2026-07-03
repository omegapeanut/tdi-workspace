# Handoff: TDI Workspace — full website + CMS

Implementation brief for **Claude Code**. Build a production website from the design references in `designs/`, using **Next.js (static export) → GitHub Pages**, **Firebase (Firestore + Auth)** for all content and leads, and **Cloudinary** for images/video.

---

## About the design files

The files in `designs/` are **design references created in HTML** — high-fidelity prototypes showing intended look and behavior. They are NOT production code. Your task is to **recreate them in a Next.js codebase**. Open each `.dc.html` in a browser to see it live; read its source for exact inline styles (every element carries its final CSS inline — copy hex values, fonts, spacing verbatim).

`designs/support.js` is a prototype-only runtime — ignore it. `designs/admin/images/` holds the current stock imagery; upload these to Cloudinary as seed content.

## Fidelity

**High-fidelity.** Recreate pixel-perfectly: colors, typography, spacing, hover states, and copy are final unless noted. The prototypes' demo logic (localStorage CMS) shows intended behavior — replace it with Firebase.

---

## Architecture (all client-side — required for GitHub Pages)

GitHub Pages serves static files only. Therefore:

- **Next.js with `output: 'export'`** in `next.config.js`. No server components doing data fetching at request time, no API routes, no middleware, no `next/image` optimization (`images: { unoptimized: true }`).
- **All dynamic data loads client-side** via the Firebase Web SDK (Firestore + Auth). Pages render layout/shell statically, then hydrate content from Firestore.
- **Cloudinary unsigned upload preset** for admin image/video uploads — direct browser → Cloudinary, no server.
- **basePath**: if deployed to `https://<user>.github.io/<repo>/`, set `basePath` and `assetPrefix` to `/<repo>` in `next.config.js`. Skip if using a custom domain.
- Add an empty `.nojekyll` file to the export output.
- Deploy via the GitHub Actions workflow in `deploy.yml` (copy to `.github/workflows/`).

### Dynamic routes on static export
Project detail (`/projects/[slug]`) and articles (`/journal/[slug]`) can't be statically generated per-Firestore-doc at build time on Pages. Use **query-param routing** instead: `/projects/view?slug=x` and `/journal/view?slug=x` (single exported page reads `slug` client-side), or hash routing. Keep listing pages at clean paths.

## Environment / config

Copy `.env.example` → `.env.local` and fill in. Firebase web config values are public-safe (security comes from Firestore rules); the Cloudinary unsigned preset name is also public-safe. Never put the Cloudinary API secret in the repo.

## Pages to build (from `designs/`)

| Route | Design file | Data source |
|---|---|---|
| `/` | TDI Home.dc.html | `settings/site` (hero headlines, CTA, announcement, hiatus), `projects` (featured), `articles`, `testimonials` fields in settings |
| `/projects` | TDI Projects.dc.html | `projects` where status in [Published, Featured] |
| `/projects/view?slug=…` | TDI Project Detail.dc.html | single `projects` doc |
| `/services` | TDI Services.dc.html | `settings/services` |
| `/process` | TDI Process.dc.html | static content (from design) |
| `/materials` | TDI Materials.dc.html | `materials` |
| `/journal` | TDI Journal.dc.html | `articles` where status in [Published, Featured] |
| `/journal/view?slug=…` | TDI Article.dc.html | single `articles` doc |
| `/calculator` | TDI Calculator.dc.html | writes to `leads` (source: "calculator") |
| `/contact` | TDI Contact.dc.html | writes to `leads` (source: "contact") |
| `/admin/login` | TDI Admin Login.dc.html | Firebase Auth (email/password) |
| `/admin` | TDI Admin.dc.html | full CMS — see below |

The site has a **Commercial / Residential mode toggle** in the nav (see Home design) — mode is client state (persist in localStorage), and hero/testimonial/featured content switches with it.

## Firestore data model

```
settings/site        { announcement, hiatus: {from, to} | null,
                       heroCommercial: {headline, cta}, heroResidential: {headline, cta},
                       story, team: [{name, role, photoUrl}],
                       testimonials: {commercial: {...}, residential: {...}},
                       seo: {title, description, keywords} }
settings/services    { commercial: [...], residential: [...] }   // ordered lists
projects/{id}        { slug, title, category: "commercial"|"residential", location,
                       summary, body, heroUrl, galleryUrls: [], status: "Draft"|"Published"|"Featured"|"Archived",
                       order, createdAt, updatedAt }
articles/{id}        { slug, title, category, excerpt, body, coverUrl,
                       status: "Draft"|"Scheduled"|"Published"|"Featured", publishedAt, order }
materials/{id}       { name, description, imageUrl, hidden: boolean, order }
leads/{id}           { name, email, phone, type, budget, message,
                       source: "contact"|"calculator", calculatorBreakdown?: {...},
                       status: "New"|"Contacted"|"Proposal sent"|"Won ✓", createdAt }
media/{id}           { publicId, url, format, width, height, tags, createdAt }  // Cloudinary index
```

Security rules are in `firestore.rules` — deploy with `firebase deploy --only firestore:rules`. Summary: public **read** on content collections (docs with published status), public **create-only** on `leads`, everything else requires an authenticated admin.

Seed Firestore with the demo content found in the prototypes' logic classes (`defaults()` in each design file) so the site looks complete on first deploy.

## Firebase Auth (admin)

- Email/password provider. Create the admin user(s) manually in the Firebase console.
- `/admin` is a client-side gated route: no auth → redirect to `/admin/login`. Match the login screen design exactly (split layout, error states).
- Rules check `request.auth != null` (optionally restrict to specific UIDs via a custom claim or an `admins/{uid}` doc).

## Cloudinary

- Create an **unsigned upload preset** (e.g. `tdi_unsigned`), folder `tdi/`. Put cloud name + preset in `.env.local`.
- Admin uploads: `POST https://api.cloudinary.com/v1_1/<cloud>/auto/upload` with `FormData {file, upload_preset}` — works for images and video. Save the returned `secure_url` + `public_id` to the relevant Firestore doc and to `media/`.
- **Delivery**: always request transformed URLs, e.g. `.../image/upload/f_auto,q_auto,w_1600/<public_id>` — heroes w_1920, project cards w_1200, journal covers w_1200, avatars w_300, thumbnails w_400. Video: `f_auto,q_auto` on `/video/upload/`.
- Seed: upload everything in `designs/admin/images/` (keep filenames as public IDs); sizes per slot are in `designs/admin/README.md`.

## Admin CMS (from TDI Admin.dc.html)

Sidebar sections — all wired to Firestore with **autosave on edit + toast** ("All edits save & go live automatically", no explicit Save button except where designed):

1. **Dashboard** — real stats (new leads this week, consultations booked), latest leads with click-to-cycle status, quick-edit links, **hiatus** control (date range → homepage notice bar shows automatically while active).
2. **Homepage** — hero headline + CTA per mode, announcement bar, featured project picker.
3. **Projects** — list with inline edit, reorder (move up/down), status cycle (Draft → Published → Featured → Archived), add/delete, Cloudinary image upload.
4. **Journal** — same pattern for articles; body editing can be a simple textarea/markdown.
5. **Materials** — rename, hide/show, reorder, image upload.
6. **Services** — names + order per mode.
7. **About & Team** — studio story, team members with photos.
8. **Media library** — grid of Cloudinary assets from `media/`, upload + copy-URL + replace.
9. **SEO** — site metadata fields.
10. **Leads** — full table with source, budget, status cycle (New → Contacted → Proposal sent → Won ✓); statuses colored per design (`stColor` in prototype logic).
11. **Users & roles** — can be a read-only list of Firebase Auth admins for v1.

Status color coding, brass accent `oklch(0.55 0.09 70)`, and all layout come from the design file.

## Design tokens

- **Fonts** (Google Fonts): Manrope 300–800 (UI/body), Cormorant Garamond 400–600 + italics (display serif). Home additionally loads Noto Serif SC.
- **Colors**: page bg `#221C15` (dark) / admin content bg `#F4F0E8`, admin sidebar `#171310`, card `#FBF8F2`; text on dark `#EFE7DA`, text on light `#26221C`; muted `#8A8172`; brass accent `oklch(0.74 0.08 78)` (on dark) / `oklch(0.55 0.09 70)` (on light); warm alert `#A0522D`; hairlines `rgba(239,231,218,.1)` on dark, `rgba(34,28,21,.1–.15)` on light.
- **Radii**: 2px buttons, 3–4px cards, 99px pills/avatars. Letter-spacing .06–.3em on uppercase labels.
- All other values: read the inline styles in the design files — they are the source of truth.

## Build order (suggested)

1. Scaffold Next.js static export + GitHub Actions deploy (get a blank page live on Pages first).
2. Firebase project wiring + Firestore rules + seed script (`scripts/seed.mjs` using demo data extracted from the prototypes).
3. Public pages (Home → Projects → Journal → rest), Commercial/Residential toggle.
4. Contact form + Calculator → `leads`.
5. Auth + admin login.
6. Admin CMS sections + Cloudinary uploads.

## Files in this handoff

- `README.md` — this brief
- `designs/*.dc.html` — the 13 page designs (open in browser)
- `designs/admin/images/` — seed imagery (+ `designs/admin/README.md` slot map)
- `firestore.rules` — Firestore security rules
- `.env.example` — required environment variables
- `deploy.yml` — GitHub Actions workflow for Pages
- `designs/TDI Explorations.dc.html` is intentionally excluded — it was early exploration, not final design.
