/* TDI Workspace — Firebase initialisation (shared by the public site + admin).
 *
 * IMPORTANT: the values below are SAFE to expose publicly. A Firebase web
 * config is NOT a secret — it only identifies your project. Real protection
 * comes from Authentication + Firestore Security Rules (see firestore.rules).
 *
 * ▶ Replace the placeholders with YOUR project's config, found at:
 *   Firebase console → Project settings (gear icon) → General tab →
 *   "Your apps" → Web app → SDK setup and configuration → "Config".
 */
(function () {
  const firebaseConfig = {
    apiKey:            "PASTE_YOUR_API_KEY",
    authDomain:        "PASTE_PROJECT_ID.firebaseapp.com",
    projectId:         "PASTE_PROJECT_ID",
    storageBucket:     "PASTE_PROJECT_ID.appspot.com",
    messagingSenderId: "PASTE_SENDER_ID",
    appId:             "PASTE_APP_ID"
  };

  if (!window.firebase || !firebase.initializeApp) {
    console.error('[TDI] Firebase SDK failed to load before firebase-config.js — check script order.');
    return;
  }
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

  // Shared handles the rest of the app uses.
  window.TDIFire = {
    auth: (typeof firebase.auth === 'function') ? firebase.auth() : null,
    db:   (typeof firebase.firestore === 'function') ? firebase.firestore() : null,
    ready: true
  };
})();
