// Static placeholder content matching designs/TDI Journal.dc.html and TDI Article.dc.html.
// TODO: replace with Firestore reads (articles collection) per README.md.

export const featuredArticle = {
  slug: "office-fit-out-costs-2026",
  cat: "commercial",
  kicker: "FEATURED · FIT-OUT GUIDES · 8 MIN READ",
  title: "Office fit-out costs in Singapore: the 2026 guide",
  excerpt: "Per-sqft benchmarks by grade, the line items that blow budgets, and where it's safe to save. Updated quarterly with live tender data.",
  meta: "June 2026 · TDI Studio · 8 min read",
  img: "/images/journal-office-costs.jpg",
  author: "TDI Studio",
  authorAvatar: "/images/team-1.jpg",
  breadcrumb: "← JOURNAL / FIT-OUT GUIDES",
  body: [
    { type: "p", text: `Every office fit-out conversation starts with the same question — "what does it cost per square foot?" — and every honest answer starts with "it depends." This guide gives you the real 2026 ranges we quote, what moves them, and where it's safe to save.` },
    { type: "h2", text: "The benchmark ranges" },
    { type: "p", text: "For a CAT B fit-out (your space, from bare or existing condition), current market rates in Singapore fall broadly into three bands, driven mostly by finish level and M&E complexity:" },
    {
      type: "table",
      headers: ["TIER", "PER SQFT", "WHAT IT BUYS"],
      rows: [
        ["Functional", "S$70 – 110", "Open plan, standard finishes, minimal M&E changes"],
        ["Mid-spec", "S$110 – 170", "Custom joinery, meeting-room builds, feature ceilings"],
        ["Premium", "S$170 – 260+", "Client-facing fronts of house, acoustic zones, natural stone & veneer"],
      ],
    },
    { type: "quote", text: "The cheapest fit-out is the one you don't redo in eighteen months." },
    { type: "h2", text: "What actually moves the number" },
    { type: "p", strong: "M&E is the silent budget-eater.", text: " Rerouting aircon, adding server-room cooling or upgrading power for a trading floor can swing costs by 20–30% before a single finish is chosen. Get the M&E survey done before you sign the lease, not after." },
    { type: "p", strong: "Reinstatement is a cost at both ends.", text: " Your outgoing space needs to be returned to bare condition — budget S$15–25 per sqft for it, and read the incoming lease's reinstatement clause before your lawyer does." },
    { type: "p", strong: "Where it's safe to save:", text: " open-ceiling in back-of-house zones, porcelain instead of natural stone in high-traffic areas, and system furniture over built-ins for anything that might move within three years." },
  ],
};

export const journalPosts = [
  { slug: "office-fit-out-costs-2026", cat: "commercial", kicker: "FIT-OUT GUIDES · 8 MIN", title: "Office fit-out costs in Singapore: the 2026 guide", excerpt: "Per-sqft benchmarks by grade, the line items that blow budgets, and where it's safe to save.", meta: "Jun 2026 · TDI Studio", img: "/images/journal-office-costs.jpg" },
  { slug: "cat-a-vs-cat-b", cat: "commercial", kicker: "TENANT ADVICE · 6 MIN", title: "CAT A vs CAT B: what office tenants actually need to know", excerpt: "The two fit-out categories, who pays for what, and the reinstatement clause everyone forgets to read.", meta: "Jun 2026 · TDI Studio", img: "/images/journal-cat-ab.jpg" },
  { slug: "office-renovation-downtime", cat: "commercial", kicker: "PLANNING · 5 MIN", title: "How much downtime does an office renovation really take?", excerpt: 'Phasing, after-hours works and the honest answer to "can we keep working through it?"', meta: "May 2026 · TDI Studio", img: "/images/journal-downtime.jpg" },
  { slug: "hdb-renovation-permits", cat: "residential", kicker: "HDB GUIDES · 7 MIN", title: "HDB renovation permits, explained in plain English", excerpt: "Which works need a permit, how long approvals take, and what happens if you skip them.", meta: "Jun 2026 · TDI Studio", img: "/images/journal-hdb-permits.jpg" },
  { slug: "bto-renovation-budget", cat: "residential", kicker: "BUDGETING · 9 MIN", title: "4-room BTO renovation: where the money actually goes", excerpt: "A real cost breakdown across carpentry, wet works and flooring — with the ranges we quote today.", meta: "May 2026 · TDI Studio", img: "/images/journal-bto-budget.jpg" },
  { slug: "vinyl-vs-engineered-wood", cat: "materials", kicker: "MATERIALS · 5 MIN", title: "Vinyl vs engineered wood: the honest comparison", excerpt: "Cost, feel, water resistance and what each floor looks like after five years of real life.", meta: "Apr 2026 · TDI Studio", img: "/images/journal-flooring.jpg" },
  { slug: "fb-kitchen-surfaces", cat: "materials", kicker: "MATERIALS · 6 MIN", title: "Choosing surfaces that survive an F&B kitchen", excerpt: "Quartz, solid surface or stainless — what health inspections and hot pans demand.", meta: "Apr 2026 · TDI Studio", img: "/images/journal-materials-guide.jpg" },
  { slug: "quiet-luxury-interiors", cat: "trends", kicker: "TRENDS · 4 MIN", title: "Quiet luxury interiors: restraint as a design language", excerpt: "Why the most expensive-looking spaces of 2026 have the fewest things in them.", meta: "Mar 2026 · TDI Studio", img: "/images/journal-trends.jpg" },
  { slug: "lighting-layers", cat: "trends", kicker: "LIGHTING · 5 MIN", title: "Lighting layers: the cheapest upgrade in interior design", excerpt: "Ambient, task, accent — how three circuits change a room more than any renovation.", meta: "Feb 2026 · TDI Studio", img: "/images/journal-lighting.jpg" },
];

export const journalCategories = [
  ["all", "ALL"],
  ["commercial", "COMMERCIAL"],
  ["residential", "RESIDENTIAL"],
  ["materials", "MATERIALS"],
  ["trends", "TRENDS & IDEAS"],
];

export function getArticleBySlug(slug) {
  if (featuredArticle.slug === slug) return featuredArticle;
  const post = journalPosts.find((p) => p.slug === slug);
  if (!post) return null;
  return {
    ...post,
    author: "TDI Studio",
    authorAvatar: "/images/team-1.jpg",
    breadcrumb: "← JOURNAL",
    body: [{ type: "p", text: post.excerpt }],
  };
}
