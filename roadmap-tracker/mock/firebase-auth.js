// Mirrors the real TEAM_LOGINS / PIN_PREFIX scheme in public/index.html —
// Terence is the admin account, the other three are regular members.
const USERS = {
  "terence@modula.local": { uid: "admin-uid", email: "terence@modula.local", password: "md-0000" },
  "yy@modula.local": { uid: "yy-uid", email: "yy@modula.local", password: "md-0001" },
  "ys@modula.local": { uid: "ys-uid", email: "ys@modula.local", password: "md-0002" },
  "jackie@modula.local": { uid: "jackie-uid", email: "jackie@modula.local", password: "md-0003" },
};

let currentUser = null;
const listeners = new Set();

function notify() { listeners.forEach((cb) => cb(currentUser)); }

export function getAuth() { return { name: "mock-auth" }; }

export function onAuthStateChanged(auth, cb) {
  listeners.add(cb);
  cb(currentUser);
  return () => listeners.delete(cb);
}

export function signInWithEmailAndPassword(auth, email, password) {
  const u = USERS[email];
  if (!u || u.password !== password) return Promise.reject(new Error("auth/invalid-credential"));
  currentUser = { uid: u.uid, email: u.email };
  notify();
  return Promise.resolve({ user: currentUser });
}

export function signOut() {
  currentUser = null;
  notify();
  return Promise.resolve();
}
