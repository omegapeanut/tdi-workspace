import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Same Firebase project as the public site and the roadmap tracker — this is
// intentional (one Firestore/Auth to manage). BusinessHQ uses its own
// `hq*`-prefixed collections and its own auth allow-list (`hqUsers`), so it
// stays fully isolated at the data level. Firebase web config is public-safe
// by design; access control lives entirely in `firestore.rules`.
const firebaseConfig = {
  apiKey: "AIzaSyALSGTJOCcMWTBO9AIS-jK0y3ipccSlRMA",
  authDomain: "tdiworkspace-26492.firebaseapp.com",
  projectId: "tdiworkspace-26492",
  storageBucket: "tdiworkspace-26492.firebasestorage.app",
  messagingSenderId: "226713671401",
  appId: "1:226713671401:web:571c2d8ad1e0af3d63c278",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Local dev / testing against the Firestore & Auth emulators instead of the
// real project: `VITE_USE_EMULATOR=true npm run dev` (see README).
if (import.meta.env.VITE_USE_EMULATOR === "true") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
}
