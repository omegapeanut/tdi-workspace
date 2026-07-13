# Roadmap Tracker — Modula Collective × V Vision

A small, private, live-updating tracker for the 4-person team executing:

1. **V Vision Collaboration** — the new AI-powered design-team partnership (3 phases, 0–24 months)
2. **Modula Collective Roadmap** — the 24-month showroom brand repositioning plan (10 phases)

It is a **standalone app**, deliberately separate from the public `tdi-workspace` marketing
site: its own Vite/React build, its own routes, no link from the public nav, and it never
ships as part of the GitHub Pages export. It reuses the **same Firebase project** as the main
site (so there's only one Firestore/Auth to manage) but through entirely separate collections
and its own auth allow-list, so it stays fully private.

Everyone can check things off, assign owners, leave notes, and bump KPI counters — the
Overview tab shows "who's on what" so the team of 4 can see progress at a glance.

## Data model (Firestore)

```
roadmapMeta/team        { members: [{id, name, color}] }        // the 4 assignable people
phases/{id}              { track: "vvision"|"modula", order, name, timeframe, summary,
                           tasks: { [taskId]: {title, status, ownerId, notes, order} },
                           kpis: [ "chip text" ] }                // small descriptive chips, not counters
kpis/{id}                { track, order, label, target, current, unit }   // 12-month numeric KPIs
discussionPoints/{id}    { text, resolved, notes, order }         // open items with the partner
roadmapMembers/{uid}     { }                                       // auth allow-list, keyed by Firebase Auth UID
```

Security: `firestore.rules` (repo root) requires a `roadmapMembers/{uid}` doc to read or write
any of the collections above — there is no public read path, unlike the main site's content
collections.

## Local development

```bash
cd roadmap-tracker
npm install
cp .env.example .env.local   # fill in Firebase web config (same values as ../.env.local)
npm run dev
```

### Using the Firestore/Auth emulators (recommended for first run)

```bash
# from repo root
firebase emulators:start --only firestore,auth

# in another terminal, from roadmap-tracker/
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node scripts/seed.mjs
```

Then set `VITE_USE_FIREBASE_EMULATOR=true` in `.env.local` and `npm run dev`. Create a user in
the Auth emulator UI (http://127.0.0.1:4000), then add a matching `roadmapMembers/{uid}` doc in
the Firestore emulator UI so that user can sign in.

## Setting up the real 4-person team

1. **Create 4 Firebase Auth users** (Firebase console → Authentication → Add user), one per
   teammate — email + password is enough.
2. **Allow-list each one**: for every user, create a Firestore doc `roadmapMembers/<their-uid>`
   (any content, e.g. `{ addedAt: <timestamp> }`). Without this doc, a signed-in user sees
   "isn't on the roadmap team list yet" and can't read any data.
3. **Seed the content** (once, against the real project):
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
     FIREBASE_PROJECT_ID=<your-project-id> node scripts/seed.mjs
   ```
4. Open the app, go to the **Team** tab, and rename the 4 placeholder teammates
   (`Teammate 1`…`Teammate 4`) to real names. This is what appears in owner dropdowns and the
   Overview "who's on what" panel — it's independent of login email, so it's fine if login
   accounts are shared or rotate.

## Deploying

This is set up as a second **Firebase Hosting site** in the same project, so it gets its own
URL and never touches the GitHub Pages deploy used by the main site.

```bash
# one-time setup
firebase hosting:sites:create modula-roadmap-tracker   # pick any available site id
firebase target:apply hosting roadmap modula-roadmap-tracker

# build + deploy
npm run build
firebase deploy --only hosting:roadmap
```

The resulting URL (`https://modula-roadmap-tracker.web.app`) is not linked from anywhere
public — treat it as a private link and share it only with the 4 teammates. There's no
additional access control at the hosting layer (Firebase Hosting doesn't support IP/password
gating), so the Firebase Auth + `roadmapMembers` allow-list described above is what actually
keeps the data private; without a matching login, the page loads but shows only the sign-in
screen and no content.

## What's deliberately out of scope for v1

- No email invites/self-signup — accounts are provisioned manually (4 people, low churn).
- No task comments/history — just a single notes field per task and per discussion point.
- KPI "current" values are plain counters anyone can bump — there's no audit trail of who
  changed what. Good enough for a 4-person team; revisit if that becomes a problem.
