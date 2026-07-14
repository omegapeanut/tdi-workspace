# Roadmap Tracker — Modula Collective × V Vision

A single self-contained page (`public/index.html` — HTML, CSS and JS all in one file,
no build step) so the 4-person team can track two roadmaps in one private, live-updating
place:

1. **V Vision Collaboration** — the new AI-powered design-team partnership (3 phases, 0–24 months)
2. **Modula Collective Roadmap** — the 24-month showroom brand repositioning plan (10 phases)

It is a **standalone app**, deliberately separate from the public `tdi-workspace` marketing
site: its own page, its own route, no link from the public nav, never part of the GitHub
Pages export. It reuses the **same Firebase project** as the main site (so there's only one
Firestore/Auth to manage) through entirely separate collections and its own auth allow-list,
so it stays fully private.

## Who can do what

Everyone who's signed in and on the team list can check tasks off, add/remove tasks within a
phase, assign owners, bump KPI counters, resolve discussion points, and post photo/notes
updates. **Admins** additionally can restructure the roadmap itself — add/delete phases, edit
KPI targets, add/delete discussion points, and edit the team roster. This is enforced in
`firestore.rules` (repo root), not just hidden in the UI — see the comments there.

## One-time setup

### 1. Fill in the CONFIG block

Open `public/index.html` and find the `CONFIG` object near the top of the `<script>` tag.
Fill in:

- `firebase` — the same web app config as the main site (`../.env.local` or Firebase console →
  Project settings → General → Your apps).
- `cloudinary.cloudName` — your Cloudinary cloud name (used for photo uploads). Create an
  **unsigned** upload preset (the main site's setup doc covers this) and put its name in
  `cloudinary.uploadPreset` — defaults to `tdi_unsigned` to match the main site's convention.

There's no `.env` file and no build step — this file is served exactly as written, so the
config values are directly in the source. That's fine for a private, auth-gated internal tool;
Firebase web config is public-safe by design (security comes from `firestore.rules`), and the
Cloudinary preset name is public-safe too (only the API secret must never appear in a repo,
and it isn't here).

### 2. Create the 4 team accounts

1. **Firebase Auth**: create 4 users (Firebase console → Authentication → Add user).
2. **Allow-list + role**: for each user, create a Firestore doc `roadmapMembers/<their-uid>`
   shaped `{ isAdmin: true }` or `{ isAdmin: false }`. Give yourself `isAdmin: true`; the other
   three `false` is fine — they can still do all the day-to-day work (checkboxes, owners,
   photos, KPI counters, resolving discussion points), just not restructure the roadmap.
   Without a `roadmapMembers` doc at all, a signed-in user sees "isn't on the team list yet"
   and can't read any data.
3. **Seed the content** (once, against the real project):
   ```bash
   cd roadmap-tracker
   npm install
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
     FIREBASE_PROJECT_ID=<your-project-id> npm run seed
   ```
4. Open the app, go to **Team**, and rename the 4 placeholder teammates (`Teammate 1`…
   `Teammate 4`) to real names — this is the identity used for task ownership and for
   "Posting as" on updates, independent of the login email, so it's fine if login accounts are
   ever shared or rotated.

### 3. Deploy the Firestore rules

```bash
# from the repo root
firebase deploy --only firestore:rules
```

## Local development

No build step — just serve the folder and open it. ES module imports (Firebase SDK from a
CDN) require `http(s)://`, not `file://`, so a plain double-click won't work.

```bash
cd roadmap-tracker/public
npx serve .
# or: python3 -m http.server 8000
```

### Using the Firestore/Auth emulators

```bash
# from repo root
firebase emulators:start --only firestore,auth

# in another terminal
cd roadmap-tracker
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 npm run seed
```

Set the `firebase` config in `CONFIG` to any placeholder values (they're only used to satisfy
the SDK's format checks locally) and temporarily point `getAuth`/`getFirestore` at the emulator
by adding `connectAuthEmulator`/`connectFirestoreEmulator` calls near the top of the script —
or just test against a real Firebase project directly, since there's no build/deploy cost to
iterating on a single static file.

## Deploying

This is set up as a second **Firebase Hosting site** in the same project, so it gets its own
URL and never touches the GitHub Pages deploy used by the main site.

```bash
# one-time setup
firebase hosting:sites:create modula-roadmap-tracker   # pick any available site id
firebase target:apply hosting roadmap modula-roadmap-tracker

# deploy (no build step — public/index.html is served as-is)
firebase deploy --only hosting:roadmap
```

The resulting URL (`https://modula-roadmap-tracker.web.app`) is not linked from anywhere
public — treat it as a private link and share it only with the 4 teammates. There's no
IP/password gate at the hosting layer (Firebase Hosting doesn't support that), so the Firebase
Auth + `roadmapMembers` allow-list described above is what actually keeps the data private:
without a matching login, the page loads to a sign-in screen and nothing else.

## Data model (Firestore)

```
roadmapMeta/team         { members: [{id, name, color}] }              // admin-writable
phases/{id}               { track: "vvision"|"modula", order, name, timeframe, summary,
                            tasks: { [taskId]: {title, done, ownerId, notes, order} },
                            kpis: [ "chip text" ] }                     // descriptive chips, not counters
kpis/{id}                 { track, order, label, target, current, unit }// 12-month numeric KPIs
discussionPoints/{id}     { text, resolved, notes, order }              // open items with the partner
updates/{id}              { phaseId, taskId, taskTitle, authorId, authorName,
                            note, photoUrl, createdAt }                 // photo/notes progress log
roadmapMembers/{uid}      { isAdmin: boolean }                          // auth allow-list, console-managed
```

## Testing without touching real Firebase

`mock/` holds a minimal in-memory stand-in for the three Firebase modules `public/index.html`
imports (`firebase-app.js`, `firebase-auth.js`, `firebase-firestore.js`) — same function
signatures, in-memory data instead of a network call. It's for local UI testing (e.g. in a
network environment that can't reach `www.gstatic.com`) by intercepting those three import URLs
with a tool like Playwright's `page.route()` and serving the mock files instead. It's never
loaded by the real app and isn't wired into anything automatically — it exists purely as a
testing aid, not part of the shipped product.

## What's deliberately out of scope for v1

- No email invites/self-signup — accounts are provisioned manually (4 people, low churn).
- No task/phase rename UI — delete and re-add if something needs restructuring.
- No edit/delete on posted update notes — they're an append-only log; only removal is offered
  (by the author or an admin).
- KPI target edits and phase/KPI/discussion-point creation are admin-gated at the
  `firestore.rules` level; day-to-day task management (add/remove tasks, check off, assign,
  note, post photos) is open to any signed-in teammate on purpose — it's a 4-person trusted
  team, and the point is to get everyone's input flowing, not to gatekeep routine updates.
