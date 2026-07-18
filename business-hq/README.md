# BusinessHQ — Modula

A simple, clean business operating system for a 2–30 person team: every employee can see what
they need to do, who owns it, what the company's goals are, their KPIs, deadlines, progress, and
what's blocking them. Built as "ClickUp Lite" — Apple-level simplicity, Linear's clean UI,
Notion's organization — deliberately avoiding ClickUp's cluttered interface.

It's a React + TypeScript + Vite app (unlike the single-file roadmap tracker, this product's
scope — a dozen+ linked entity types, role-based views, board/list task views — needed real
components and type safety). It shares the **same Firebase project** as the public site and the
roadmap tracker (one Firestore/Auth to manage) through its own `hq*`-prefixed collections and its
own auth allow-list (`hqUsers`), so it stays fully isolated at the data level.

## Layout

Sidebar (exactly this list, per the product spec — no more):

**Dashboard · My Tasks · Projects · Goals · Departments · Calendar · People · Reports ·
Documents · Notifications · Settings**

**Fully working in v1:** Dashboard, My Tasks (list + board views), Projects (overview,
milestones, tasks, discussion, risks, activity), Goals (Company → Department → Project →
Milestone → Task rollup), Departments, People (directory + scorecards), Reports, Notifications
(computed live from your tasks/goals — see below), Settings.

**Stubbed for now** (shown in the nav with a "Soon" badge, routed to a clean "Coming soon"
page so adding them later needs no nav/routing rework): **Calendar**, **Documents**. My Tasks'
Table and Calendar sub-views are also a follow-up — List and Board cover the core workflows for
v1.

**Architecture-only, not built** (per the product spec — "keep these modular and disabled until
implemented"): CRM, Finance, Invoices, Procurement, Inventory, Assets, Client/Vendor Portal,
Helpdesk, Time Clock, Leave Management, Recruitment, Payroll, AI Assistant, Chat, Email,
Approvals, OKRs, Risk Register (beyond the light per-project Risks tab), Meeting Management,
Forms, Workflow Builder. The data model (`src/types.ts`) uses stable IDs and normalized
references specifically so none of these need a schema rewrite to bolt on later.

## How progress "automation" works

The spec describes a cascade — task complete → milestone updates → project updates → department
goal updates → company goal updates. At this scale (2–30 people, the whole workspace already
loaded live into memory) that's implemented as **pure, on-read computation** (`src/lib/rollup.ts`)
instead of a chain of Firestore writes or Cloud Functions: progress is always correct because
it's derived, never stale because nothing is cached. Same idea for **Notifications**
(`src/lib/notifications.ts`) — assigned-to-you, due-tomorrow, overdue, and goal-achieved items are
computed from live data rather than written to a separate collection.

## One-time setup

### 1. Create the 4 team accounts + seed content

`scripts/seed.mjs` does the whole thing in one run: creates the 4 real Firebase Auth accounts
(if they don't already exist), their BusinessHQ profiles, sample departments, goals, projects,
milestones, tasks, KPIs and an announcement. Safe to re-run — Auth account creation is idempotent
and all writes use deterministic IDs.

```bash
cd business-hq
npm install
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
  FIREBASE_PROJECT_ID=<your-project-id> npm run seed
```

From Google Cloud Shell (no key file needed — ambient credentials are auto-detected):

```bash
cd business-hq && npm install
FIREBASE_PROJECT_ID=<your-project-id> npm run seed
```

| Name | Login shown | PIN | Role |
|---|---|---|---|
| Terence | Terence | `0000` | Owner |
| YY | YY | `0001` | Admin |
| YS | YS | `0002` | Manager |
| Jackie | Jackie | `0003` | Employee |

Same name-picker-and-PIN login model as the roadmap tracker (`src/config.ts`'s `TEAM_LOGINS` +
`PIN_PREFIX`) — Firebase Auth still backs each person with a real, fixed email/password account
under the hood. There's no self-service invite flow in v1 (see Settings → "Add a teammate" for
the admin-driven process for a 5th+ person).

### 2. Deploy the Firestore rules

The `hq*` collection rules live in the repo root's `firestore.rules` alongside the public site's
and the roadmap tracker's:

```bash
firebase deploy --only firestore:rules
```

### 3. Create the Hosting site (one-time)

```bash
firebase hosting:sites:create modula --project tdiworkspace-26492
```

`.firebaserc`/`firebase.json` already map the `hq` hosting target to this site, so no
`firebase target:apply` step is needed on a fresh clone.

## Local development

```bash
cd business-hq
npm install
npm run dev
```

By default this talks to the real Firebase project. To develop against the local emulators
instead:

```bash
# terminal 1, from the repo root
firebase emulators:start --only firestore,auth

# terminal 2
cd business-hq
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 npm run seed
VITE_USE_EMULATOR=true npm run dev
```

## Deploying

Live at **https://modula.web.app**.

```bash
# from the repo root, once logged in (`firebase login`)
cd business-hq && npm install && npm run build && cd ..
firebase deploy --only hosting:hq --project tdiworkspace-26492
```

### Recommended: git-based deploys from Cloud Shell

Same workflow as the roadmap tracker — clone once with a GitHub personal access token (paste it
directly into Cloud Shell yourself; never relay it through a chat message), then:

```bash
cd ~/tdi-workspace
git pull
cd business-hq && npm install && npm run build && cd ..
npx firebase-tools@latest deploy --only hosting:hq --project tdiworkspace-26492
```

## Data model (Firestore)

```
hqUsers/{uid}          { name, email, role, departmentId, managerId, jobTitle,
                          avatarColor, availability, ...audit }        // the auth allow-list
hqDepartments/{id}      { name, leadId, color, ...audit }
hqGoals/{id}            { level, title, description, departmentId, parentGoalId, ownerId,
                          metricLabel, target, current, unit, dueDate, ...audit }
hqProjects/{id}         { name, description, goalId, departmentId, ownerId, memberIds,
                          dueDate, budget, priority, projectStatus, risks, ...audit }
hqMilestones/{id}       { projectId, title, order, ownerId, dueDate, blocked,
                          dependsOnMilestoneIds, ...audit }
hqTasks/{id}            { title, description, projectId, milestoneId, parentTaskId,
                          departmentId, ownerId, approverId, followerIds, collaboratorIds,
                          priority, taskStatus, dueDate, estimatedHours, actualHours, tags,
                          checklist, dependsOnTaskIds, repeat, order, ...audit }
hqComments/{id}         { entityType, entityId, authorId, text, ...audit }   // task/project discussion
hqActivity/{id}         { entityType, entityId, actorId, action, detail, ...audit }  // immutable log
hqKpis/{id}             { label, category, ownerId, departmentId, current, target, unit,
                          period, history, ...audit }
hqAnnouncements/{id}    { title, body, authorId, pinned, ...audit }
```

Every entity carries `createdBy`, `updatedBy`, `createdAt`, `updatedAt`, `status` (soft delete —
`"active" | "archived" | "deleted"`, never a hard `deleteDoc`) per the spec's non-functional
requirements. Relations are ID references only — nothing is denormalized — so rollups/joins
happen client-side in `src/lib/rollup.ts` and `src/lib/select.ts`.

## Permissions

Enforced in `firestore.rules`, not just hidden in the UI (`src/lib/permissions.ts` mirrors the
same rules for the client):

- **Owner** — everything.
- **Admin** — everything except billing (there's no billing surface yet, so in practice this
  equals Owner today).
- **Manager** — their own department: department goals, and day-to-day project/task work.
- **Employee** — their own work; day-to-day project/task editing (checking things off, adding
  tasks, commenting) is open to any signed-in teammate on purpose, same rationale as the roadmap
  tracker — it's a small trusted team, and the point is collaboration, not gatekeeping routine
  updates. Restructuring (company goals, departments, the roster, KPI targets) is admin-gated.

## What's deliberately out of scope for v1

- No self-service signup/invites, no self-service PIN reset — an Owner/Admin provisions accounts
  (Firebase console for the Auth account, Settings → "Add a teammate" for the profile).
- Table and Calendar views on My Tasks (List and Board ship first).
- File attachments (noted inline in each Project's Overview tab as coming soon).
- Every module listed under "Future Features" in the product spec — intentionally
  architecture-ready, not implemented (see "Architecture-only" above).
