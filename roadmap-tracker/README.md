# Roadmap Tracker — Modula × V Vision

A single self-contained page (`public/index.html` — HTML, CSS and JS all in one file,
no build step) so the 4-person team can track two roadmaps in one private, live-updating
place:

1. **V Vision Collaboration** — the new AI-powered design-team partnership (3 phases, 0–24 months)
2. **Modula Roadmap** — the 24-month showroom brand repositioning plan (10 phases)

It is a **standalone app**, deliberately separate from the public `tdi-workspace` marketing
site: its own page, its own route, no link from the public nav, never part of the GitHub
Pages export. It reuses the **same Firebase project** as the main site (so there's only one
Firestore/Auth to manage) through entirely separate collections and its own auth allow-list,
so it stays fully private.

## Layout

Four sections, reached from the top nav:

- **Dashboard** — the landing view. "My tasks" (matched to your login by name) grouped into
  In progress / Not started / Recently done, plus overall stats, a per-track progress card for
  each roadmap (click one to jump into Roadmap pre-filtered), and a "who's on what" workload
  grid.
- **Roadmap** — both roadmaps in one filterable view (`All` / `V Vision Collaboration` /
  `Modula Roadmap` pills), instead of separate tabs. Task rows are compact cards: an avatar chip
  shows the owner, and clicking the avatar or the "⋯" button reveals reassign/notes/remove
  controls instead of showing them all the time. KPI targets live only here (previously they
  were duplicated between Overview and the Modula tab).
- **Gallery** — every photo/note update, in one wall.
- **Team** — the roster tasks are assigned against; admins can rename or add/remove people here.

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

The login screen shows a **name picker + 4-digit PIN**, not an email/password form. Under the
hood Firebase Auth still needs a real email + a 6+ character password per person — the app
supplies both automatically from the `TEAM_LOGINS` list and `PIN_PREFIX` constant near the top
of `public/index.html`'s `<script>` tag. Create exactly these 4 accounts in Firebase console →
**Authentication** → **Add user**:

| Name | Email (paste exactly) | Password (paste exactly) | PIN they'll actually type |
|---|---|---|---|
| Terence | `terence@modula.local` | `md-0000` | `0000` |
| YY | `yy@modula.local` | `md-0001` | `0001` |
| YS | `ys@modula.local` | `md-0002` | `0002` |
| Jackie | `jackie@modula.local` | `md-0003` | `0003` |

If you ever add a 5th teammate or change these emails, update the `TEAM_LOGINS` array in
`public/index.html` to match — the dropdown is generated from that list.

2. **Seed the content and the admin allow-list** (once, against the real project). The 4 real
   UIDs and roles are already hardcoded in `scripts/seed.mjs`'s `roadmapMembers` object (Terence
   is admin, the other three are regular members) — this single run creates
   `roadmapMeta/team` (with the 4 real names), all the phases/KPIs/discussion points, **and**
   the `roadmapMembers/{uid}` allow-list doc for each person, so there's no separate manual
   Firestore step:
   ```bash
   cd roadmap-tracker
   npm install
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json \
     FIREBASE_PROJECT_ID=<your-project-id> npm run seed
   ```
   Without a `roadmapMembers` doc, a signed-in user sees "isn't on the team list yet" and can't
   read any data — if you ever add a 5th teammate, add their UID to `roadmapMembers` in
   `scripts/seed.mjs` (or create the doc by hand in the Firestore console) and re-run the seed.

Anyone can reset their own PIN later from a regular device by asking an admin to update their
password in the Firebase console (there's no self-service "forgot PIN" flow in v1 — see
"Out of scope" below).

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

Live at **https://modula-roadmap.web.app** — a second, named Firebase Hosting site on the same
project (`tdiworkspace-26492`), so the URL says "Modula" instead of the project ID. The main
public site doesn't use Firebase Hosting at all (it deploys to GitHub Pages), so there's no
conflict. No build step — `public/index.html` is served as-is. The `firebase.json` hosting block
and `.firebaserc` `targets` mapping in the repo root already point at this site, so a plain
`firebase deploy --only hosting:roadmap` from a fresh clone works with no extra setup.

```bash
# from the repo root, once logged in (`firebase login`)
firebase deploy --only hosting:roadmap --project tdiworkspace-26492
```

That's it — re-run this any time `public/index.html` changes to push an update.

### Recommended: git-based deploys from Cloud Shell

The fastest, least error-prone way to deploy updates (avoids ever hand-pasting file contents,
which is how a corrupted API key made it into a previous deploy): clone this repo directly in
Google Cloud Shell and deploy from the real checkout.

**One-time setup, per Cloud Shell environment:**

1. Open [Cloud Shell](https://console.cloud.google.com) and make sure it's on the
   `tdiworkspace-26492` project (`gcloud config set project tdiworkspace-26492` if not).
2. Generate a GitHub **Personal Access Token** (GitHub → Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → scope it to just this repo, Contents:
   Read-only is enough for pulling).
3. Clone the repo using the token as the password when prompted (or embed it in the URL —
   either way, paste the token directly into Cloud Shell yourself; never relay a token through
   a chat message, since long secret-shaped strings can get corrupted in transit):
   ```bash
   git clone https://github.com/omegapeanut/tdi-workspace.git
   cd tdi-workspace
   ```

**Every time you want to push an update after that:**

```bash
cd ~/tdi-workspace
git pull
npx firebase-tools@latest deploy --only hosting:roadmap --project tdiworkspace-26492
```

If Cloud Shell ever asks you to log in to Firebase again, run `npx firebase-tools@latest login --no-localhost`
once and follow the printed URL/code flow.

The URL is not linked from anywhere public — treat it as a private link and share it only with
the 4 teammates. There's no IP/password gate at the hosting layer (Firebase Hosting doesn't
support that), so the Firebase Auth + `roadmapMembers` allow-list described above is what
actually keeps the data private: without a matching login, the page loads to a sign-in screen
and nothing else.

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
- No self-service "forgot PIN" — resetting a PIN means an admin updates that person's password
  in the Firebase console (Authentication → user row → Reset password), to the new `md-XXXX`
  value. A 4-digit PIN is meaningfully weaker than a real password; acceptable here since this
  is a private, unlisted URL for 4 trusted people and Firebase Auth throttles repeated failed
  sign-ins automatically — revisit if that stops being true (e.g. the link leaks, or the team
  grows).
- No task/phase rename UI — delete and re-add if something needs restructuring.
- No edit/delete on posted update notes — they're an append-only log; only removal is offered
  (by the author or an admin).
- KPI target edits and phase/KPI/discussion-point creation are admin-gated at the
  `firestore.rules` level; day-to-day task management (add/remove tasks, check off, assign,
  note, post photos) is open to any signed-in teammate on purpose — it's a 4-person trusted
  team, and the point is to get everyone's input flowing, not to gatekeep routine updates.
