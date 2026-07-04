// Seeds Firestore with the site's current content so the Admin CMS has
// something real to edit, and public pages have something real to read.
//
// Local/emulator use (no credentials needed):
//   firebase emulators:start --only firestore,auth   (in one terminal)
//   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 \
//     node scripts/seed.mjs --with-demo-admin
//
// Real project use:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
//     FIREBASE_PROJECT_ID=<your-project-id> node scripts/seed.mjs

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
const projectId = process.env.FIREBASE_PROJECT_ID || (usingEmulator ? "tdi-workspace-preview" : undefined);

if (!usingEmulator && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    "Refusing to run against a real Firebase project without GOOGLE_APPLICATION_CREDENTIALS set.\n" +
      "Set FIRESTORE_EMULATOR_HOST to seed the local emulator instead."
  );
  process.exit(1);
}

initializeApp(usingEmulator ? { projectId } : { credential: applicationDefault(), projectId });

const db = getFirestore();

// ---------------------------------------------------------------------------
// Content extracted from lib/*.js and the About page — the single source of
// truth for what's live today, migrated into the shape the CMS edits.
// ---------------------------------------------------------------------------

const settingsHome = {
  hero: {
    C: {
      kicker: "COMMERCIAL DESIGN & BUILD — SINGAPORE · 匠心营造",
      headline: "Where work finds its form.",
      ctaLabel: "FREE CONSULTATION →",
      body: "Offices, restaurants and flagship retail — designed, built and handed over by one accountable team.",
      image: "/images/hero-commercial.jpg",
      imageAlt: "Commercial interior — boardroom with timber slats",
    },
    R: {
      kicker: "RESIDENTIAL INTERIORS — HDB · CONDO · LANDED · 家的质感",
      headline: "Quiet luxury, made livable.",
      ctaLabel: "FREE CONSULTATION →",
      body: "Homes composed with restraint — planned around how you actually live, priced before you commit.",
      image: "/images/hero-residential.jpg",
      imageAlt: "Residential interior — living room with warm lamps",
    },
  },
  announcement: "",
  hiatus: null,
  proofStats: {
    C: [
      { value: "140+", label: "COMMERCIAL PROJECTS DELIVERED" },
      { value: "15", label: "YEARS OF DESIGN & BUILD" },
      { value: "92%", label: "HANDED OVER ON OR AHEAD OF TIME" },
      { value: "1", label: "CONTRACT, ONE ACCOUNTABLE TEAM" },
    ],
    R: [
      { value: "60+", label: "HOMES COMPLETED" },
      { value: "4.9★", label: "AVERAGE CLIENT RATING" },
      { value: "0", label: "HIDDEN COSTS — ITEMISED QUOTES" },
      { value: "12mo", label: "DEFECTS CARE AFTER HANDOVER" },
    ],
  },
  testimonial: {
    C: {
      quote:
        "They treated our downtime like it cost money — because it does. We moved back in a week early, and the space still stops visitors at the door.",
      avatar: "/images/avatar-commercial.jpg",
      name: "Operations Director",
      role: "Fintech HQ, Raffles Place",
    },
    R: {
      quote: "The quote we signed was the amount we paid. Ten weeks, one WhatsApp group, zero drama — and a home that finally feels like ours.",
      avatar: "/images/avatar-residential.jpg",
      name: "Homeowners, Tengah",
      role: "4-room BTO, full renovation",
    },
  },
  trustedBy: {
    C: { label: "TRUSTED BY TEAMS AT", items: ["NOVA BANK", "Herring & Co.", "KOPI CULTURE", "Atlas Retail", "MEDFIRST"] },
    R: { label: "AS FEATURED ON", items: ["Qanvast", "RENONATION", "Home & Decor", "STACKED"] },
  },
  finalCta: {
    C: {
      kicker: "START A PROJECT",
      headline: "Let's scope your space — proposal in 5 working days.",
      body: "Send us your floor plan and headcount. We'll return a space plan, timeline and budget band — before you commit to anything.",
      primary: { label: "REQUEST A PROPOSAL", href: "/contact" },
      secondary: { label: "DOWNLOAD COMPANY PROFILE", href: "/contact" },
    },
    R: {
      kicker: "START YOUR RENOVATION",
      headline: "Know your number before you commit.",
      body: "Two minutes, five questions — an honest cost range for your HDB, condo or landed renovation. Estimates only; your consultation makes it exact.",
      primary: { label: "ESTIMATE MY RENOVATION", href: "/calculator" },
      secondary: { label: "BOOK A CONSULTATION", href: "/contact" },
    },
  },
};

const settingsAbout = {
  story:
    "TDI Workspace started on the contractor's side of the table — which is why our drawings survive contact with the site. Fifteen years on, we design and build commercial spaces first and homes with the same rigour: one contract, one accountable team, one number we stand behind.\n\nWe stay deliberately mid-sized. Every project is led by a director, not handed down — that's the difference clients feel at week six, when decisions need someone who can actually make them.",
  stats: [
    { value: "200+", label: "PROJECTS ACROSS SINGAPORE" },
    { value: "15", label: "YEARS OF DESIGN & BUILD" },
    { value: "28", label: "DESIGNERS, PMS & CRAFTSMEN" },
    { value: "70%", label: "OF WORK FROM REFERRALS" },
  ],
  team: [
    { name: "[ Name ]", role: "DESIGN DIRECTOR", bio: "Leads concept and space planning. 14 years across workplace and hospitality.", img: "/images/team-1.jpg" },
    { name: "[ Name ]", role: "PROJECTS DIRECTOR", bio: "Owns every build programme and the Friday photo report. Ex-main-contractor.", img: "/images/team-2.jpg" },
    { name: "[ Name ]", role: "CLIENT DIRECTOR", bio: "Your first call and your last sign-off — from consultation to defects care.", img: "/images/team-3.jpg" },
  ],
  credentials: [
    { title: "BCA-registered", body: "Registered with the Building & Construction Authority for interior works." },
    { title: "HDB-licensed contractor", body: "Listed on the HDB Directory of Renovation Contractors." },
    { title: "bizSAFE Level 3", body: "Workplace safety & health management certified; fully insured works." },
  ],
  trustedByLogos: ["NOVA BANK", "Herring & Co.", "KOPI CULTURE", "Atlas Retail", "MEDFIRST CLINICS"],
};

const settingsServices = {
  C: [
    {
      num: "01",
      name: "Office design & fit-out",
      img: "/images/project-fintech.jpg",
      desc: "CAT B fit-outs, expansions and reinstatements — planned around headcount, hybrid work and your lease clock.",
      items: ["Space planning & test fits", "M&E coordination", "Landlord & authority submissions", "Custom joinery & acoustics"],
    },
    {
      num: "02",
      name: "F&B & hospitality",
      img: "/images/project-izakaya.jpg",
      desc: "Restaurants, cafés and bars built for service flow, kitchen compliance and an opening date that holds.",
      items: ["Concept & brand translation", "Kitchen & bar layout", "SFA / URA licensing support", "Fast-track build programmes"],
    },
    {
      num: "03",
      name: "Retail & showroom",
      img: "/images/project-boutique.jpg",
      desc: "Brand-first stores and showrooms where millwork, lighting and merchandising are designed as one.",
      items: ["Flagship & chain rollouts", "Custom display millwork", "Lighting design", "Mall & landlord approvals"],
    },
    {
      num: "04",
      name: "Clinics & wellness",
      img: "/images/project-clinic.jpg",
      desc: "Compliant, calming healthcare environments — from GP suites to dental and aesthetic studios.",
      items: ["MOH compliance planning", "Infection-control detailing", "Patient-flow layouts", "Medical M&E provisions"],
    },
  ],
  R: [
    {
      num: "01",
      name: "Whole-home renovation",
      img: "/images/project-maisonette.jpg",
      desc: "HDB, condo and landed — full design, permits and build under one contract, one accountable team.",
      items: ["Space planning & 3D views", "HDB permit submissions", "Hacking to handover", "12-month defects care"],
    },
    {
      num: "02",
      name: "Kitchens & wet works",
      img: "/images/project-hdb-kitchen.jpg",
      desc: "Hacking, tiling, plumbing and waterproofing — the unglamorous work that decides whether a home lasts.",
      items: ["Kitchen & bathroom overhauls", "Waterproofing warranties", "Tiling & stonework", "Plumbing rerouting"],
    },
    {
      num: "03",
      name: "Custom carpentry",
      img: "/images/project-bto.jpg",
      desc: "Built-in wardrobes, feature walls, study nooks and storage measured to the millimetre — made in our own workshop.",
      items: ["Wardrobes & storage walls", "TV consoles & feature walls", "Study & vanity built-ins", "Soft-close hardware as standard"],
    },
    {
      num: "04",
      name: "Styling & lighting",
      img: "/images/project-penthouse.jpg",
      desc: "The last 10% that makes it feel finished — lighting plans, curtains, loose furniture and styling.",
      items: ["Lighting plans & fittings", "Curtains & blinds", "Furniture sourcing", "Move-in styling"],
    },
  ],
};

const settingsSeo = {
  pages: {
    "/": { title: "TDI Workspace", description: "TDI Workspace — interior design studio" },
  },
};

const projectsSeed = [
  { name: "Fintech HQ, Raffles Place", mode: "C", tag: "OFFICE", catKey: "office", meta: "12,400 SQFT · DESIGN & BUILD · 14 WEEKS", img: "/images/project-fintech.jpg", status: "Featured" },
  { name: "Izakaya, Duxton Hill", mode: "C", tag: "F&B", catKey: "fnb", meta: "2,100 SQFT · DESIGN & BUILD · 9 WEEKS", img: "/images/project-izakaya.jpg", status: "Featured" },
  { name: "Flagship boutique, Orchard", mode: "C", tag: "RETAIL", catKey: "retail", meta: "3,800 SQFT · FIT-OUT · 11 WEEKS", img: "/images/project-boutique.jpg", status: "Featured" },
  { name: "Dental studio, Novena", mode: "C", tag: "CLINIC", catKey: "clinic", meta: "1,600 SQFT · DESIGN & BUILD · 10 WEEKS", img: "/images/project-clinic.jpg", status: "Published" },
  { name: "Coworking loft, CBD", mode: "C", tag: "OFFICE", catKey: "office", meta: "8,900 SQFT · FIT-OUT · 12 WEEKS", img: "/images/project-coworking.jpg", status: "Published" },
  { name: "Heritage restaurant, Amoy St", mode: "C", tag: "F&B", catKey: "fnb", meta: "2,700 SQFT · RESTORATION + BUILD · 13 WEEKS", img: "/images/project-restaurant.jpg", status: "Published" },
  { name: "Maisonette, Bukit Timah", mode: "R", tag: "LANDED", catKey: "landed", meta: "1,650 SQFT · FULL RENOVATION · 10 WEEKS", img: "/images/project-maisonette.jpg", status: "Featured" },
  { name: "4-room BTO, Tengah", mode: "R", tag: "HDB", catKey: "hdb", meta: "990 SQFT · FULL RENOVATION · 8 WEEKS", img: "/images/project-bto.jpg", status: "Featured" },
  { name: "Penthouse, Newton", mode: "R", tag: "CONDO", catKey: "condo", meta: "2,300 SQFT · FULL RENOVATION · 12 WEEKS", img: "/images/project-penthouse.jpg", status: "Featured" },
  { name: "Master suite, Holland Village", mode: "R", tag: "CONDO", catKey: "condo", meta: "1,450 SQFT · PARTIAL RENOVATION · 6 WEEKS", img: "/images/project-condo-bedroom.jpg", status: "Published" },
  { name: "Semi-detached, Serangoon", mode: "R", tag: "LANDED", catKey: "landed", meta: "3,600 SQFT · REBUILD INTERIORS · 18 WEEKS", img: "/images/project-landed.jpg", status: "Published" },
  { name: "Resale kitchen, Bishan", mode: "R", tag: "HDB", catKey: "hdb", meta: "1,180 SQFT · KITCHEN & WET WORKS · 5 WEEKS", img: "/images/project-hdb-kitchen.jpg", status: "Published" },
].map((p, i) => ({ ...p, id: slugify(p.name), order: i, alt: `${p.name} — TDI Workspace project` }));

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const featuredArticleBody = [
  {
    type: "p",
    text: `Every office fit-out conversation starts with the same question — "what does it cost per square foot?" — and every honest answer starts with "it depends." This guide gives you the real 2026 ranges we quote, what moves them, and where it's safe to save.`,
  },
  { type: "h2", text: "The benchmark ranges" },
  { type: "p", text: "For a CAT B fit-out (your space, from bare or existing condition), current market rates in Singapore fall broadly into three bands, driven mostly by finish level and M&E complexity:" },
  {
    type: "table",
    headers: ["TIER", "PER SQFT", "WHAT IT BUYS"],
    rows: [
      { cells: ["Functional", "S$70 – 110", "Open plan, standard finishes, minimal M&E changes"] },
      { cells: ["Mid-spec", "S$110 – 170", "Custom joinery, meeting-room builds, feature ceilings"] },
      { cells: ["Premium", "S$170 – 260+", "Client-facing fronts of house, acoustic zones, natural stone & veneer"] },
    ],
  },
  { type: "quote", text: "The cheapest fit-out is the one you don't redo in eighteen months." },
  { type: "h2", text: "What actually moves the number" },
  { type: "p", strong: "M&E is the silent budget-eater.", text: " Rerouting aircon, adding server-room cooling or upgrading power for a trading floor can swing costs by 20–30% before a single finish is chosen. Get the M&E survey done before you sign the lease, not after." },
  { type: "p", strong: "Reinstatement is a cost at both ends.", text: " Your outgoing space needs to be returned to bare condition — budget S$15–25 per sqft for it, and read the incoming lease's reinstatement clause before your lawyer does." },
  { type: "p", strong: "Where it's safe to save:", text: " open-ceiling in back-of-house zones, porcelain instead of natural stone in high-traffic areas, and system furniture over built-ins for anything that might move within three years." },
];

const articlesSeed = [
  { slug: "office-fit-out-costs-2026", cat: "commercial", kicker: "FIT-OUT GUIDES · 8 MIN", title: "Office fit-out costs in Singapore: the 2026 guide", excerpt: "Per-sqft benchmarks by grade, the line items that blow budgets, and where it's safe to save.", meta: "Jun 2026 · TDI Studio", img: "/images/journal-office-costs.jpg", status: "Featured", seo: 92, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL / FIT-OUT GUIDES", body: featuredArticleBody },
  { slug: "cat-a-vs-cat-b", cat: "commercial", kicker: "TENANT ADVICE · 6 MIN", title: "CAT A vs CAT B: what office tenants actually need to know", excerpt: "The two fit-out categories, who pays for what, and the reinstatement clause everyone forgets to read.", meta: "Jun 2026 · TDI Studio", img: "/images/journal-cat-ab.jpg", status: "Published", seo: 88, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL", body: [{ type: "p", text: "The two fit-out categories, who pays for what, and the reinstatement clause everyone forgets to read." }] },
  { slug: "office-renovation-downtime", cat: "commercial", kicker: "PLANNING · 5 MIN", title: "How much downtime does an office renovation really take?", excerpt: 'Phasing, after-hours works and the honest answer to "can we keep working through it?"', meta: "May 2026 · TDI Studio", img: "/images/journal-downtime.jpg", status: "Published", seo: 84, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL", body: [{ type: "p", text: 'Phasing, after-hours works and the honest answer to "can we keep working through it?"' }] },
  { slug: "hdb-renovation-permits", cat: "residential", kicker: "HDB GUIDES · 7 MIN", title: "HDB renovation permits, explained in plain English", excerpt: "Which works need a permit, how long approvals take, and what happens if you skip them.", meta: "Jun 2026 · TDI Studio", img: "/images/journal-hdb-permits.jpg", status: "Published", seo: 90, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL", body: [{ type: "p", text: "Which works need a permit, how long approvals take, and what happens if you skip them." }] },
  { slug: "bto-renovation-budget", cat: "residential", kicker: "BUDGETING · 9 MIN", title: "4-room BTO renovation: where the money actually goes", excerpt: "A real cost breakdown across carpentry, wet works and flooring — with the ranges we quote today.", meta: "May 2026 · TDI Studio", img: "/images/journal-bto-budget.jpg", status: "Published", seo: 85, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL", body: [{ type: "p", text: "A real cost breakdown across carpentry, wet works and flooring — with the ranges we quote today." }] },
  { slug: "vinyl-vs-engineered-wood", cat: "materials", kicker: "MATERIALS · 5 MIN", title: "Vinyl vs engineered wood: the honest comparison", excerpt: "Cost, feel, water resistance and what each floor looks like after five years of real life.", meta: "Apr 2026 · TDI Studio", img: "/images/journal-flooring.jpg", status: "Published", seo: 81, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL", body: [{ type: "p", text: "Cost, feel, water resistance and what each floor looks like after five years of real life." }] },
  { slug: "fb-kitchen-surfaces", cat: "materials", kicker: "MATERIALS · 6 MIN", title: "Choosing surfaces that survive an F&B kitchen", excerpt: "Quartz, solid surface or stainless — what health inspections and hot pans demand.", meta: "Apr 2026 · TDI Studio", img: "/images/journal-materials-guide.jpg", status: "Published", seo: 83, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL", body: [{ type: "p", text: "Quartz, solid surface or stainless — what health inspections and hot pans demand." }] },
  { slug: "quiet-luxury-interiors", cat: "trends", kicker: "TRENDS · 4 MIN", title: "Quiet luxury interiors: restraint as a design language", excerpt: "Why the most expensive-looking spaces of 2026 have the fewest things in them.", meta: "Mar 2026 · TDI Studio", img: "/images/journal-trends.jpg", status: "Published", seo: 80, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL", body: [{ type: "p", text: "Why the most expensive-looking spaces of 2026 have the fewest things in them." }] },
  { slug: "lighting-layers", cat: "trends", kicker: "LIGHTING · 5 MIN", title: "Lighting layers: the cheapest upgrade in interior design", excerpt: "Ambient, task, accent — how three circuits change a room more than any renovation.", meta: "Feb 2026 · TDI Studio", img: "/images/journal-lighting.jpg", status: "Published", seo: 79, author: "TDI Studio", authorAvatar: "/images/team-1.jpg", breadcrumb: "← JOURNAL", body: [{ type: "p", text: "Ambient, task, accent — how three circuits change a room more than any renovation." }] },
].map((a, i) => ({ ...a, id: a.slug, order: i }));

const materialsSeed = [
  { id: "oak", name: "Smoked oak veneer", tag: "WOOD", cat: "wood", desc: "Warm mid-tone oak with visible grain. Feature walls, joinery fronts, ceilings.", finish: "Matt lacquer", care: "Low maintenance", img: "/images/material-wood.jpg" },
  { id: "marble", name: "Calacatta marble", tag: "MARBLE", cat: "stone", desc: "Bold-veined statement stone. Reception counters, feature cladding, vanities.", finish: "Honed / polished", care: "Seal yearly", img: "/images/material-marble.jpg" },
  { id: "stone", name: "Sandblasted granite", tag: "STONE", cat: "stone", desc: "Muted, durable natural stone. Flooring, external thresholds, wet areas.", finish: "Sandblasted", care: "Very durable", img: "/images/material-stone.jpg" },
  { id: "tiles", name: "Zellige-look tiles", tag: "TILES", cat: "tiles", desc: "Handmade texture in glazed ceramic. Kitchen backsplashes, bathroom walls, F&B counters.", finish: "Gloss glaze", care: "Wipe clean", img: "/images/material-tiles.jpg" },
  { id: "fabric", name: "Bouclé upholstery", tag: "FABRIC", cat: "fabric", desc: "Soft loop-pile textile. Banquettes, headboards, acoustic panels.", finish: "Stain-guarded", care: "Vacuum weekly", img: "/images/material-fabric.jpg" },
  { id: "metal", name: "Brushed brass", tag: "METAL", cat: "metal", desc: "The house accent. Handles, trims, lighting, signage.", finish: "Brushed, lacquered", care: "Ages gracefully", img: "/images/material-metal.jpg" },
  { id: "terrazzo", name: "Porcelain terrazzo", tag: "TILES", cat: "tiles", desc: "Terrazzo look with porcelain toughness. High-traffic floors, F&B and retail.", finish: "Matt R10", care: "Very durable", img: "/images/material-terrazzo.jpg" },
  { id: "glass", name: "Fluted glass", tag: "GLASS", cat: "glass", desc: "Privacy with light. Partitions, shower screens, cabinet fronts.", finish: "Clear / low-iron", care: "Wipe clean", img: "/images/material-glass.jpg" },
].map((m, i) => ({ ...m, hidden: false, order: i }));

async function seedDoc(path, data) {
  await db.doc(path).set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: false });
  console.log(`✓ ${path}`);
}

async function seedCollection(name, items) {
  const batch = db.batch();
  items.forEach((item) => {
    const { id, ...rest } = item;
    const ref = id ? db.collection(name).doc(id) : db.collection(name).doc();
    batch.set(ref, { ...rest, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  });
  await batch.commit();
  console.log(`✓ ${name} (${items.length} docs)`);
}

async function seedDemoAdmin() {
  const auth = getAuth();
  const email = "admin@tdiworkspace.sg";
  const password = "demo-password-123";
  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch {
    user = await auth.createUser({ email, password, emailVerified: true });
  }
  await db.collection("admins").doc(user.uid).set({ email, role: "Admin" });
  console.log(`✓ demo admin — ${email} / ${password} (uid ${user.uid})`);
}

async function main() {
  await seedDoc("settings/home", settingsHome);
  await seedDoc("settings/about", settingsAbout);
  await seedDoc("settings/services", settingsServices);
  await seedDoc("settings/seo", settingsSeo);
  await seedCollection("projects", projectsSeed);
  await seedCollection("articles", articlesSeed);
  await seedCollection("materials", materialsSeed);

  if (usingEmulator && process.argv.includes("--with-demo-admin")) {
    await seedDemoAdmin();
  }

  console.log("\nSeed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
