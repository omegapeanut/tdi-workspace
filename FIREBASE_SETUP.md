# Firebase Setup — TDI Workspace

Follow these once in the **Firebase console** (console.firebase.google.com). ~10 minutes.

## 1. Create / open your project
- Console → **Add project** (or open your existing one).
- Note your **Project ID** — you'll need it below.

## 2. Enable Authentication (the real login)
1. Left sidebar → **Build → Authentication → Get started**.
2. **Sign-in method** tab → enable **Email/Password** → Save.
3. **Users** tab → **Add user** → enter your admin email + a strong password.
   - This is the account you'll log into `admin.html` with.
   - Add one user per staff member who needs admin access.
   - ⚠️ There is intentionally **no public sign-up** — only users you add here can log in.

## 3. Create the database
1. Left sidebar → **Build → Firestore Database → Create database**.
2. Start in **production mode** (we ship real rules below).
3. Pick location **asia-southeast1 (Singapore)** for speed.

## 4. Register a Web App + get your config
1. Project **Settings** (gear icon) → **General** → scroll to **Your apps**.
2. Click the **Web** icon (`</>`), give it a nickname (e.g. "TDI Site"), register.
3. Copy the `firebaseConfig` values it shows you.
4. Paste them into **`firebase-config.js`** in this project (replace the `PASTE_…` placeholders).

## 5. Publish the security rules
**Option A — console (easiest):** Firestore Database → **Rules** tab → paste the
contents of **`firestore.rules`** → **Publish**.

**Option B — CLI / Claude Code:**
```bash
npm install -g firebase-tools
firebase login
firebase init firestore        # select your project; accept firestore.rules
firebase deploy --only firestore:rules
```

## 6. (Recommended) Host on Firebase
Since you're all-in on Firebase, hosting here is one command and wires the
auth domain automatically:
```bash
firebase init hosting          # set public dir to "." , single-page: No
firebase deploy --only hosting
```
Your site goes live at `https://PROJECT_ID.web.app`. (You can still use GitHub
Pages instead — Firebase Auth + Firestore work from any host. If you do, add
your Pages domain under Authentication → Settings → **Authorized domains**.)

## 7. Test the loop
1. Open the live site → submit the **inquiry form**.
2. Open `admin.html` → log in with the user from step 2.
3. The new inquiry should appear in the **Inquiries** tab, live.

---
**Where things live**
- `firebase-config.js` — your project keys (safe to be public).
- `firestore.rules` — who can read/write what (the real security).
- Inquiries are stored in the **`inquiries`** collection in Firestore.
