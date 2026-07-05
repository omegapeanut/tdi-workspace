// Auto-generated SEO metadata with optional per-page overrides from the CMS
// (settings/seo, edited in /admin). Resolution order for every page:
//   1. Explicit CMS override (admin typed something in)
//   2. Auto-generated from the page's own live content (article/project title + excerpt)
//   3. Static hand-written default for known routes
//   4. Generic fallback derived from the URL path (covers pages nobody configured)
// This means a brand-new page always gets a sane title/description with zero
// admin effort — the SEO panel is for fine-tuning, not a required chore.

export const SITE_NAME = "TDI Workspace";
export const SITE_TAGLINE = "Commercial & residential interior design and build, Singapore";
export const SITE_URL = "https://omegapeanut.github.io/tdi-workspace";

export const DEFAULT_DESCRIPTION =
  "TDI Workspace is a Singapore interior design and build studio — offices, F&B, retail and homes, delivered by one accountable team from concept to handover.";

// Hand-written defaults for the site's known static routes. These read the
// actual copy on each page, so they're miles better than a generic fallback —
// but they're still just the *default* tier: a CMS override always wins.
export const PAGE_DEFAULTS = {
  "/": {
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: DEFAULT_DESCRIPTION,
  },
  "/projects": {
    title: `Projects — ${SITE_NAME}`,
    description:
      "Browse TDI Workspace's portfolio of commercial and residential interior design projects across Singapore — offices, restaurants, retail, HDB, condo and landed homes.",
  },
  "/services": {
    title: `Services — ${SITE_NAME}`,
    description:
      "Office fit-outs, F&B and retail design, whole-home renovation, kitchens, custom carpentry and styling — see what TDI Workspace takes on.",
  },
  "/process": {
    title: `Our Process — ${SITE_NAME}`,
    description:
      "Six steps, no surprises: how TDI Workspace takes your project from consultation to handover, with an itemised quote and defects care included.",
  },
  "/journal": {
    title: `Journal — ${SITE_NAME}`,
    description:
      "Renovation guides, cost breakdowns and honest advice from TDI Workspace — office fit-out costs, HDB permits, material comparisons and more.",
  },
  "/materials": {
    title: `Material Library — ${SITE_NAME}`,
    description:
      "Explore the materials TDI Workspace specifies — wood, stone, tiles, fabric, metal and glass — and shortlist your favourites before your consultation.",
  },
  "/about": {
    title: `About — ${SITE_NAME}`,
    description:
      "Builders first, designers always: meet the studio behind 200+ projects across Singapore, BCA-registered, HDB-licensed and bizSAFE Level 3.",
  },
  "/calculator": {
    title: `Renovation Cost Calculator — ${SITE_NAME}`,
    description:
      "Get an honest renovation cost estimate for your HDB, condo or landed home in two minutes — based on prevailing Singapore market rates.",
  },
  "/contact": {
    title: `Contact — ${SITE_NAME}`,
    description:
      "Book a free 30-minute consultation with a TDI Workspace director — tell us about your space and we'll tell you what's possible and what it costs.",
  },
};

export function truncate(str, max = 158) {
  if (!str) return "";
  const clean = str.trim().replace(/\s+/g, " ");
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

// Last-resort generator for any page with no override and no PAGE_DEFAULTS
// entry — e.g. a route added later and never wired into PAGE_DEFAULTS.
function fallbackFromPath(path) {
  const segment = path.split("/").filter(Boolean).pop() || "";
  const words = segment.replace(/[-_]+/g, " ").replace(/\?.*$/, "").trim();
  const title = words ? words.replace(/\b\w/g, (c) => c.toUpperCase()) : SITE_NAME;
  return {
    title: title === SITE_NAME ? SITE_NAME : `${title} — ${SITE_NAME}`,
    description: DEFAULT_DESCRIPTION,
  };
}

/**
 * Resolve the {title, description} to render for a page.
 *
 * @param path        route path, e.g. "/journal" (used for overrides + fallback)
 * @param overrides   seo.pages[path] from Firestore settings/seo, if loaded
 * @param dynamic     content-derived {title, description} for detail pages
 *                     (e.g. a journal article) — beats the static default but
 *                     still loses to an explicit override
 */
export function resolveSeo({ path, overrides, dynamic }) {
  const base = PAGE_DEFAULTS[path] || dynamic || fallbackFromPath(path);
  const fromDynamic = dynamic ? { title: dynamic.title, description: truncate(dynamic.description) } : null;
  const merged = { ...base, ...fromDynamic };
  const override = overrides?.[path];
  return {
    title: override?.title?.trim() || merged.title,
    description: truncate(override?.description?.trim() || merged.description),
  };
}

export function articleSeo(article) {
  if (!article) return null;
  return {
    title: `${article.title} — ${SITE_NAME} Journal`,
    description: article.excerpt || article.body?.find((b) => b.type === "p")?.text,
  };
}
