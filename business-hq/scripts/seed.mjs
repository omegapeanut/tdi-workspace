// Seeds BusinessHQ with a real team (4 accounts, auto-created in Firebase
// Auth if they don't exist yet) plus sample departments/goals/projects/KPIs
// so the app has real content on first login. Safe to re-run: Auth account
// creation is idempotent (looks up existing accounts by email instead of
// erroring), and all Firestore writes use deterministic doc IDs.
//
// Local/emulator use (no credentials needed):
//   firebase emulators:start --only firestore,auth   (in one terminal, from repo root)
//   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 node scripts/seed.mjs
//
// Real project use (local machine with a downloaded service account key):
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
//     FIREBASE_PROJECT_ID=<your-project-id> node scripts/seed.mjs
//
// Real project use (Google Cloud Shell — no key file needed):
//   FIREBASE_PROJECT_ID=<your-project-id> node scripts/seed.mjs

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
const usingAmbientCredentials = Boolean(process.env.CLOUD_SHELL) || Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const projectId = process.env.FIREBASE_PROJECT_ID || (usingEmulator ? "tdiworkspace-26492" : undefined);

if (!usingEmulator && !usingAmbientCredentials) {
  console.error(
    "Refusing to run against a real Firebase project without credentials.\n" +
      "Set GOOGLE_APPLICATION_CREDENTIALS (local key file), run this from Google Cloud Shell " +
      "(ambient credentials, auto-detected), or set FIRESTORE_EMULATOR_HOST to seed the local emulator."
  );
  process.exit(1);
}

initializeApp(usingEmulator ? { projectId } : { credential: applicationDefault(), projectId });
const db = getFirestore();
const auth = getAuth();

const now = Date.now();
function audit(overrides = {}) {
  return { createdBy: "seed", updatedBy: "seed", createdAt: now, updatedAt: now, status: "active", ...overrides };
}

// ---------------------------------------------------------------------------
// Team accounts — same 4 real people as the roadmap tracker, different app
// (separate Firebase Auth accounts, @hq.modula.local instead of @modula.local).
// ---------------------------------------------------------------------------

const PIN_PREFIX = "hq-";
const TEAM = [
  { id: "terence", name: "Terence", email: "terence@hq.modula.local", pin: "0000", role: "owner", departmentId: "dept-ops", jobTitle: "Founder & Owner" },
  { id: "yy", name: "YY", email: "yy@hq.modula.local", pin: "0001", role: "admin", departmentId: "dept-marketing", jobTitle: "Marketing Lead" },
  { id: "ys", name: "YS", email: "ys@hq.modula.local", pin: "0002", role: "manager", departmentId: "dept-design", jobTitle: "Design Manager" },
  { id: "jackie", name: "Jackie", email: "jackie@hq.modula.local", pin: "0003", role: "employee", departmentId: "dept-sales", jobTitle: "Sales Executive" },
];
const AVATAR_COLORS = ["#8A9A7E", "#BE8C5C", "#7A93A8", "#B5533C"];

async function ensureAuthUser(person) {
  try {
    const existing = await auth.getUserByEmail(person.email);
    return existing.uid;
  } catch {
    const created = await auth.createUser({
      uid: person.id, // deterministic uid so seeding is fully idempotent
      email: person.email,
      password: PIN_PREFIX + person.pin,
    });
    return created.uid;
  }
}

// ---------------------------------------------------------------------------
// Departments, Goals, Projects, Milestones, Tasks, KPIs, Announcement
// ---------------------------------------------------------------------------

const departments = [
  { id: "dept-sales", name: "Sales", leadId: "jackie", color: "#8A9A7E" },
  { id: "dept-marketing", name: "Marketing", leadId: "yy", color: "#BE8C5C" },
  { id: "dept-design", name: "Design", leadId: "ys", color: "#7A93A8" },
  { id: "dept-ops", name: "Operations", leadId: "terence", color: "#B5533C" },
];

const goals = [
  {
    id: "goal-revenue", level: "company", title: "Increase Revenue 30%", description: "Grow topline revenue 30% this fiscal year.",
    departmentId: null, parentGoalId: null, ownerId: "terence", metricLabel: "Revenue", target: 100, current: 38, unit: "%", dueDate: null,
  },
  {
    id: "goal-leads", level: "department", title: "Generate 500 Leads", description: "Marketing-driven pipeline for the sales team.",
    departmentId: "dept-marketing", parentGoalId: "goal-revenue", ownerId: "yy", metricLabel: "Leads", target: 500, current: 210, unit: "", dueDate: null,
  },
  {
    id: "goal-showroom", level: "department", title: "Showroom Experience Upgrade", description: "Make the showroom a place designers love bringing clients.",
    departmentId: "dept-design", parentGoalId: "goal-revenue", ownerId: "ys", metricLabel: "Progress", target: 100, current: 0, unit: "%", dueDate: null,
  },
];

const projects = [
  {
    id: "proj-website", name: "Website Redesign", description: "Rebuild the marketing site to support the new lead-gen goal.",
    goalId: "goal-leads", departmentId: "dept-marketing", ownerId: "yy", memberIds: ["yy", "ys"],
    dueDate: now + 45 * 86400000, budget: 12000, priority: "high", projectStatus: "active", risks: [],
  },
  {
    id: "proj-showroom", name: "Showroom Upgrade", description: "Coffee bar, meeting rooms, interactive kitchen & wardrobe displays.",
    goalId: "goal-showroom", departmentId: "dept-design", ownerId: "ys", memberIds: ["ys", "terence"],
    dueDate: now + 90 * 86400000, budget: 30000, priority: "medium", projectStatus: "planning", risks: [
      { id: "risk-1", text: "Contractor availability may push the timeline out 2-3 weeks.", severity: "medium" },
    ],
  },
  {
    id: "proj-partners", name: "Design Partner Programme Launch", description: "Recruit and onboard the first cohort of design partners.",
    goalId: null, departmentId: "dept-sales", ownerId: "jackie", memberIds: ["jackie", "terence"],
    dueDate: now + 30 * 86400000, budget: null, priority: "critical", projectStatus: "active", risks: [],
  },
];

const milestones = [
  { id: "ms-web-1", projectId: "proj-website", title: "Homepage UI", order: 0, ownerId: "ys", dueDate: now + 14 * 86400000, blocked: false, dependsOnMilestoneIds: [] },
  { id: "ms-web-2", projectId: "proj-website", title: "Build & Launch", order: 1, ownerId: "yy", dueDate: now + 45 * 86400000, blocked: false, dependsOnMilestoneIds: ["ms-web-1"] },
  { id: "ms-show-1", projectId: "proj-showroom", title: "Planning", order: 0, ownerId: "ys", dueDate: now + 10 * 86400000, blocked: false, dependsOnMilestoneIds: [] },
  { id: "ms-show-2", projectId: "proj-showroom", title: "Construction", order: 1, ownerId: "terence", dueDate: now + 60 * 86400000, blocked: true, dependsOnMilestoneIds: ["ms-show-1"] },
];

function task(overrides) {
  return {
    description: "", milestoneId: null, parentTaskId: null, approverId: null, followerIds: [], collaboratorIds: [],
    dueDate: null, estimatedHours: null, actualHours: null, tags: [], checklist: [], dependsOnTaskIds: [],
    repeat: "none", taskStatus: "not_started", priority: "medium", order: 0, ...overrides,
  };
}

const tasks = [
  task({ id: "t-web-1", title: "Design Hero Banner", projectId: "proj-website", milestoneId: "ms-web-1", departmentId: "dept-design", ownerId: "ys", taskStatus: "in_progress", order: 0 }),
  task({ id: "t-web-2", title: "Write Copy", projectId: "proj-website", milestoneId: "ms-web-1", departmentId: "dept-marketing", ownerId: "yy", taskStatus: "not_started", order: 1 }),
  task({ id: "t-web-3", title: "Build Page", projectId: "proj-website", milestoneId: "ms-web-2", departmentId: "dept-design", ownerId: "ys", taskStatus: "not_started", order: 0,
    checklist: [{ id: "c1", text: "Responsive layout", done: false }, { id: "c2", text: "Cross-browser check", done: false }] }),
  task({ id: "t-web-4", title: "Testing", projectId: "proj-website", milestoneId: "ms-web-2", departmentId: "dept-marketing", ownerId: "yy", taskStatus: "not_started", order: 1 }),
  task({ id: "t-web-5", title: "Launch", projectId: "proj-website", milestoneId: "ms-web-2", departmentId: "dept-marketing", ownerId: "terence", taskStatus: "not_started", priority: "critical", order: 2 }),
  task({ id: "t-show-1", title: "Finalise floor plan", projectId: "proj-showroom", milestoneId: "ms-show-1", departmentId: "dept-design", ownerId: "ys", taskStatus: "completed", order: 0 }),
  task({ id: "t-show-2", title: "Get contractor quotes", projectId: "proj-showroom", milestoneId: "ms-show-1", departmentId: "dept-ops", ownerId: "terence", taskStatus: "in_progress", order: 1 }),
  task({ id: "t-show-3", title: "Install coffee bar", projectId: "proj-showroom", milestoneId: "ms-show-2", departmentId: "dept-ops", ownerId: "terence", taskStatus: "blocked", order: 0 }),
  task({ id: "t-partners-1", title: "Build outreach database", projectId: "proj-partners", departmentId: "dept-sales", ownerId: "jackie", taskStatus: "completed", order: 0,
    dueDate: now - 5 * 86400000 }),
  task({ id: "t-partners-2", title: "Visit first 10 design firms", projectId: "proj-partners", departmentId: "dept-sales", ownerId: "jackie", taskStatus: "in_progress", priority: "high",
    dueDate: now + 2 * 86400000, order: 1 }),
  task({ id: "t-partners-3", title: "Prepare partner proposal deck", projectId: "proj-partners", departmentId: "dept-sales", ownerId: "terence", taskStatus: "review",
    dueDate: now - 86400000, order: 2 }),
  task({ id: "t-partners-4", title: "Send partnership agreement template to legal", projectId: "proj-partners", departmentId: "dept-sales", ownerId: "jackie", taskStatus: "not_started",
    dueDate: now + 86400000, order: 3 }),
];

const kpis = [
  // Company-wide (no owner, no department) — feed the Dashboard progress rings.
  { id: "kpi-sales", label: "Monthly Revenue Target", category: "sales", ownerId: null, departmentId: null, current: 62000, target: 100000, unit: "$", period: "2026-07", history: [] },
  { id: "kpi-marketing", label: "Marketing Target", category: "marketing", ownerId: null, departmentId: null, current: 210, target: 500, unit: "leads", period: "2026-07", history: [] },
  { id: "kpi-dev", label: "Development Target", category: "development", ownerId: null, departmentId: null, current: 4, target: 10, unit: "features", period: "2026-07", history: [] },
  { id: "kpi-ops", label: "Operations Target", category: "operations", ownerId: null, departmentId: null, current: 78, target: 100, unit: "%", period: "2026-07", history: [] },
  // Personal KPIs
  { id: "kpi-jackie-deals", label: "Deals Closed", category: "sales", ownerId: "jackie", departmentId: null, current: 3, target: 8, unit: "", period: "2026-07", history: [] },
  { id: "kpi-jackie-response", label: "Lead Response Time", category: "sales", ownerId: "jackie", departmentId: null, current: 4, target: 2, unit: "hrs", period: "2026-07", history: [] },
  { id: "kpi-yy-content", label: "Content Published", category: "marketing", ownerId: "yy", departmentId: null, current: 6, target: 8, unit: "posts", period: "2026-07", history: [] },
  { id: "kpi-ys-features", label: "Milestones Completed", category: "development", ownerId: "ys", departmentId: null, current: 2, target: 4, unit: "", period: "2026-07", history: [] },
];

const announcements = [
  { id: "ann-1", title: "Welcome to BusinessHQ", body: "This replaces scattered spreadsheets and group chats — everything you're on the hook for lives here now.", authorId: "terence", pinned: true },
];

async function run() {
  const uidByPersonId = {};
  for (const person of TEAM) {
    uidByPersonId[person.id] = await ensureAuthUser(person);
  }

  const batch = db.batch();

  for (const [i, person] of TEAM.entries()) {
    const uid = uidByPersonId[person.id];
    batch.set(db.doc(`hqUsers/${uid}`), audit({
      name: person.name, email: person.email, role: person.role, departmentId: person.departmentId,
      managerId: person.role === "owner" ? null : uidByPersonId.terence, jobTitle: person.jobTitle,
      avatarColor: AVATAR_COLORS[i], availability: "available",
    }));
  }

  for (const d of departments) {
    const { id, leadId, ...rest } = d;
    batch.set(db.doc(`hqDepartments/${id}`), audit({ ...rest, leadId: uidByPersonId[leadId] ?? null }));
  }

  for (const g of goals) {
    const { id, ownerId, ...rest } = g;
    batch.set(db.doc(`hqGoals/${id}`), audit({ ...rest, ownerId: uidByPersonId[ownerId] ?? null }));
  }

  for (const p of projects) {
    const { id, ownerId, memberIds, ...rest } = p;
    batch.set(db.doc(`hqProjects/${id}`), audit({
      ...rest, ownerId: uidByPersonId[ownerId] ?? null, memberIds: memberIds.map((m) => uidByPersonId[m]),
    }));
  }

  for (const m of milestones) {
    const { id, ownerId, ...rest } = m;
    batch.set(db.doc(`hqMilestones/${id}`), audit({ ...rest, ownerId: uidByPersonId[ownerId] ?? null }));
  }

  for (const t of tasks) {
    const { id, ownerId, ...rest } = t;
    batch.set(db.doc(`hqTasks/${id}`), audit({ ...rest, ownerId: uidByPersonId[ownerId] ?? null }));
  }

  for (const k of kpis) {
    const { id, ownerId, ...rest } = k;
    batch.set(db.doc(`hqKpis/${id}`), audit({ ...rest, ownerId: ownerId ? (uidByPersonId[ownerId] ?? null) : null }));
  }

  for (const a of announcements) {
    const { id, authorId, ...rest } = a;
    batch.set(db.doc(`hqAnnouncements/${id}`), audit({ ...rest, authorId: uidByPersonId[authorId] }));
  }

  await batch.commit();

  console.log(`Seeded ${TEAM.length} accounts, ${departments.length} departments, ${goals.length} goals,`);
  console.log(`${projects.length} projects, ${milestones.length} milestones, ${tasks.length} tasks,`);
  console.log(`${kpis.length} KPIs, ${announcements.length} announcement.`);
  console.log("\nSign in with:");
  for (const p of TEAM) console.log(`  ${p.name.padEnd(8)} PIN ${p.pin}  (${p.role})`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
