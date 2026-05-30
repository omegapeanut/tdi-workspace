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
    apiKey:            "AIzaSyALSGTJOCcMWTBO9AIS-jK0y3ipccSlRMA",
    authDomain:        "tdiworkspace-26492.firebaseapp.com",
    projectId:         "tdiworkspace-26492",
    storageBucket:     "tdiworkspace-26492.firebasestorage.app",
    messagingSenderId: "226713671401",
    appId:             "1:226713671401:web:571c2d8ad1e0af3d63c278",
    measurementId:     "G-M0LH73LHKV"
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
