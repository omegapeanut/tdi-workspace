// Seeds Firestore with the two roadmaps (V Vision collaboration + Modula
// Collective 24-month plan) so the tracker has real content on first load.
// Safe to re-run: uses deterministic doc IDs, so it overwrites rather than duplicates.
//
// Local/emulator use (no credentials needed):
//   firebase emulators:start --only firestore,auth   (in one terminal, from repo root)
//   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/seed.mjs
//
// Real project use:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
//     FIREBASE_PROJECT_ID=<your-project-id> node scripts/seed.mjs

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
// Helpers
// ---------------------------------------------------------------------------

function tasks(titles) {
  const out = {};
  titles.forEach((title, i) => {
    out[`t${i + 1}`] = { title, done: false, ownerId: null, notes: "", order: i };
  });
  return out;
}

// ---------------------------------------------------------------------------
// Team — placeholder names; rename in the app's Team tab once accounts exist.
// ---------------------------------------------------------------------------

const team = [
  { id: "m1", name: "Teammate 1", color: "#8A9A7E" },
  { id: "m2", name: "Teammate 2", color: "#BE8C5C" },
  { id: "m3", name: "Teammate 3", color: "#7A8CA0" },
  { id: "m4", name: "Teammate 4", color: "#B5533C" },
];

// ---------------------------------------------------------------------------
// V Vision collaboration — 3 phases
// ---------------------------------------------------------------------------

const vvisionPhases = [
  {
    id: "vv-1-foundation",
    track: "vvision",
    order: 1,
    name: "Foundation",
    timeframe: "0–6 Months",
    summary: "Build the core team, operate from the showroom, and ship the first working deliverables.",
    tasks: tasks([
      "Team: fill Sales role",
      "Team: fill Interior Designer role",
      "Team: fill Marketing & Content role",
      "Objective: operate from showroom",
      "Objective: promote modular furniture",
      "Objective: sell smart home & renovation services",
      "Objective: standardise the AI design workflow",
      "Objective: build marketing content pipeline",
      "Objective: generate project leads",
      "Deliverable: AI design presentation",
      "Deliverable: marketing system",
      "Deliverable: sales process documented",
      "Deliverable: customer experience defined",
      "Deliverable: project management process defined",
    ]),
    kpis: [],
  },
  {
    id: "vv-2-validation",
    track: "vvision",
    order: 2,
    name: "Validation",
    timeframe: "6–12 Months",
    summary: "Prove the model works: volume, conversion, and a repeatable process.",
    tasks: tasks([
      "Increase project volume",
      "Improve conversion",
      "Refine the AI workflow",
      "Develop designer training",
      "Build repeatable processes",
    ]),
    kpis: ["Consistent monthly sales", "Strong customer satisfaction", "Stable operating process", "Independent team"],
  },
  {
    id: "vv-3-expansion",
    track: "vvision",
    order: 3,
    name: "Expansion",
    timeframe: "Year 1–2",
    summary: "Turn the collaboration into a dedicated division. Showroom becomes a Customer Experience Centre, Design Hub, and Training Centre.",
    tasks: tasks([
      "Establish dedicated division",
      "Scale to ~10 interior designers",
      "Build dedicated sales & marketing teams",
      "Set up operations support",
    ]),
    kpis: ["Customer Experience Centre", "Design Hub", "Training Centre"],
  },
];

const discussionPoints = [
  "Roles & Responsibilities",
  "Resource Sharing",
  "Showroom Utilisation",
  "Sales Process",
  "Marketing Strategy",
  "Business Targets",
  "Future Growth Opportunities",
].map((text, i) => ({ id: `dp${i + 1}`, text, resolved: false, notes: "", order: i }));

// ---------------------------------------------------------------------------
// Modula Collective — 24-month brand roadmap, 10 phases
// ---------------------------------------------------------------------------

const modulaPhases = [
  {
    id: "mc-1-foundation",
    track: "modula",
    order: 1,
    name: "Foundation & Strategy",
    timeframe: "Month 1–2",
    summary: "Finalise branding, standardise product info, and build the partner programme foundation.",
    tasks: tasks([
      "Finalise branding",
      "Set up appointment-only showroom model",
      "Standardise product information",
      "Build partner programme structure",
      "Deliverable: logo & brand guidelines",
      "Deliverable: partner proposal deck",
      "Deliverable: product catalogue",
      "Deliverable: price guide",
      "Deliverable: sample kits",
      "Deliverable: appointment booking system",
      "Deliverable: CRM for designers",
    ]),
    kpis: [],
  },
  {
    id: "mc-2-outreach",
    track: "modula",
    order: 2,
    name: "Local Industry Outreach",
    timeframe: "Month 2–3",
    summary: "Map the market and start visiting ID firms, architects, contractors, developers and consultants.",
    tasks: tasks([
      "Research & map interior design firms",
      "Research & map architecture firms",
      "Research & map main contractors",
      "Research & map developers",
      "Research & map property consultants",
      "Build outreach database (company, contact, designer count, existing suppliers, meeting status)",
      "Visit every target office personally",
      "Offer coffee sessions / lunch presentations / showroom tours",
    ]),
    kpis: ["Target: 50–100 companies"],
  },
  {
    id: "mc-3-partner-launch",
    track: "modula",
    order: 3,
    name: "Partner Programme Launch",
    timeframe: "Month 3–4",
    summary: "Launch the Design Partner Programme with a full benefits stack.",
    tasks: tasks([
      "Launch Design Partner Programme",
      "Stand up appointment showroom benefit",
      "Stand up product training benefit",
      "Stand up technical support benefit",
      "Prepare 3D resources for partners",
      "Prepare sample sets for partners",
      "Set up priority quotations process",
      "Set up installation support",
      "Assign dedicated project manager",
      "Build partner marketing support offering",
    ]),
    kpis: ["Goal: 20 active partners"],
  },
  {
    id: "mc-4-training",
    track: "modula",
    order: 4,
    name: "Training Academy",
    timeframe: "Month 4–6",
    summary: "Monthly training curriculum leading to an authorised-partner certificate.",
    tasks: tasks([
      "Plan monthly training calendar",
      "Curriculum: modular kitchen & wardrobe systems",
      "Curriculum: feature walls & TV consoles",
      "Curriculum: materials & hardware (incl. Blum, Australian systems)",
      "Curriculum: installation process & common mistakes",
      "Design certificate programme",
      "Define \"authorised partner\" criteria",
    ]),
    kpis: [],
  },
  {
    id: "mc-5-marketing-foundation",
    track: "modula",
    order: 5,
    name: "Marketing Foundation",
    timeframe: "Month 4–8",
    summary: "Website, SEO, and Google Business Profile.",
    tasks: tasks([
      "Build Singapore website (projects, products, downloads, booking, designer registration, blog, FAQ)",
      "Target SEO keyword set (modular kitchen SG, premium cabinetry, designer showroom, interior system…)",
      "Improve Google Business Profile (reviews, photos, weekly updates)",
    ]),
    kpis: [],
  },
  {
    id: "mc-6-ai-marketing",
    track: "modula",
    order: 6,
    name: "AI Marketing",
    timeframe: "Ongoing from Month 6",
    summary: "Weekly content engine across platforms.",
    tasks: tasks([
      "Weekly AI-rendered interior content",
      "Before & after content series",
      "Project walkthroughs / installation videos",
      "Product animation content",
      "Testimonials & designer interviews",
    ]),
    kpis: ["3–5 posts/week", "IG · TikTok · LinkedIn · YouTube Shorts · Xiaohongshu"],
  },
  {
    id: "mc-7-designer-resources",
    track: "modula",
    order: 7,
    name: "Designer Resources",
    timeframe: "Month 7+",
    summary: "Make it easy for designers to specify your products.",
    tasks: tasks([
      "Build CAD block library",
      "Build SketchUp / Revit model library",
      "Build material & texture library",
      "Publish price guide & specification sheets",
      "Launch designer downloads portal",
    ]),
    kpis: [],
  },
  {
    id: "mc-8-showroom-upgrade",
    track: "modula",
    order: 8,
    name: "Showroom Experience Upgrade",
    timeframe: "Month 8+",
    summary: "Make it a place designers enjoy bringing clients.",
    tasks: tasks([
      "Add coffee bar",
      "Add meeting rooms",
      "Install large TV / presentation setup",
      "Build sample wall & material library display",
      "Set up lighting & hardware display",
      "Build interactive kitchen experience",
      "Build wardrobe experience",
      "Add kids' corner",
    ]),
    kpis: [],
  },
  {
    id: "mc-9-campaigns",
    track: "modula",
    order: 9,
    name: "Marketing Campaigns",
    timeframe: "Ongoing from Month 9",
    summary: "One event a month, every month.",
    tasks: tasks([
      "Plan monthly designer/architect nights",
      "Plan a product launch event",
      "Plan a CPD-style learning session",
      "Plan a networking session",
    ]),
    kpis: ["4 showroom events / quarter"],
  },
  {
    id: "mc-10-expansion",
    track: "modula",
    order: 10,
    name: "Expansion",
    timeframe: "After 12 Months",
    summary: "Add complementary modular product lines.",
    tasks: tasks([
      "Evaluate bathroom systems line",
      "Evaluate laundry systems line",
      "Evaluate walk-in wardrobe systems",
      "Evaluate home office / storage systems",
      "Evaluate aluminium systems",
      "Evaluate smart home integration",
    ]),
    kpis: ["Become a one-stop modular solutions centre"],
  },
];

const modulaKpis = [
  { id: "kpi-id-firms", track: "modula", order: 1, label: "Interior design firms contacted", target: 100, current: 0, unit: "" },
  { id: "kpi-architects", track: "modula", order: 2, label: "Architect firms contacted", target: 50, current: 0, unit: "" },
  { id: "kpi-partners", track: "modula", order: 3, label: "Active design partners", target: 50, current: 0, unit: "" },
  { id: "kpi-training", track: "modula", order: 4, label: "Training sessions / month", target: 2, current: 0, unit: "" },
  { id: "kpi-events", track: "modula", order: 5, label: "Showroom events / quarter", target: 4, current: 0, unit: "" },
  { id: "kpi-social", track: "modula", order: 6, label: "Social media posts / week", target: 5, current: 0, unit: "" },
  { id: "kpi-blog", track: "modula", order: 7, label: "Blog articles / month", target: 2, current: 0, unit: "" },
  { id: "kpi-reviews", track: "modula", order: 8, label: "Google reviews / month", target: 10, current: 0, unit: "" },
  { id: "kpi-appointments", track: "modula", order: 9, label: "Qualified showroom appointments / month", target: 20, current: 0, unit: "" },
  { id: "kpi-projects", track: "modula", order: 10, label: "Projects secured / month", target: 10, current: 0, unit: "" },
];

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

async function run() {
  const batch = db.batch();

  batch.set(db.doc("roadmapMeta/team"), { members: team });

  for (const phase of [...vvisionPhases, ...modulaPhases]) {
    const { id, ...data } = phase;
    batch.set(db.doc(`phases/${id}`), data);
  }

  for (const kpi of modulaKpis) {
    const { id, ...data } = kpi;
    batch.set(db.doc(`kpis/${id}`), data);
  }

  for (const point of discussionPoints) {
    const { id, ...data } = point;
    batch.set(db.doc(`discussionPoints/${id}`), data);
  }

  await batch.commit();
  console.log(
    `Seeded ${vvisionPhases.length + modulaPhases.length} phases, ${modulaKpis.length} KPIs, ` +
      `${discussionPoints.length} discussion points, and ${team.length} placeholder team members.`
  );
  console.log(
    "Next: add your 4 teammates as Firebase Auth users, then for each create a roadmapMembers/{uid} doc " +
      "(Firebase console → Firestore) shaped { isAdmin: true|false }. Give yourself isAdmin: true so you can " +
      "add/edit phases, KPI targets and discussion points — the other three can check off tasks, bump KPI " +
      "counters and post photo updates, but can't restructure the roadmap itself."
  );
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
