const USERS = {
  "admin@modulacollective.sg": { uid: "admin-uid", email: "admin@modulacollective.sg", password: "demo-password-123" },
  "member@modulacollective.sg": { uid: "member-uid", email: "member@modulacollective.sg", password: "demo-password-123" },
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
