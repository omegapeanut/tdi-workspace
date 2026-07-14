// Minimal in-memory Firestore mock — just enough surface area to exercise
// public/index.html's rendering and interaction logic without real network
// calls (used only for local testing when the real Firebase CDN is
// unreachable; production always talks to the real Firebase project).

const DELETE_FIELD = Symbol("deleteField");

const store = {
  phases: {
    "vv-1-foundation": { track: "vvision", order: 1, name: "Foundation", timeframe: "0–6 Months", summary: "Build the core team.",
      tasks: {
        t1: { title: "Team: fill Sales role", done: false, ownerId: null, notes: "", order: 0 },
        t2: { title: "Objective: operate from showroom", done: true, ownerId: "m1", notes: "Confirmed with landlord.", order: 1 },
      }, kpis: [] },
    "vv-2-validation": { track: "vvision", order: 2, name: "Validation", timeframe: "6–12 Months", summary: "Prove the model works.",
      tasks: { t1: { title: "Increase project volume", done: false, ownerId: "m2", notes: "", order: 0 } },
      kpis: ["Consistent monthly sales", "Independent team"] },
    "mc-1-foundation": { track: "modula", order: 1, name: "Foundation & Strategy", timeframe: "Month 1–2", summary: "Finalise branding.",
      tasks: {
        t1: { title: "Finalise branding", done: true, ownerId: "m1", notes: "", order: 0 },
        t2: { title: "Deliverable: logo & brand guidelines", done: false, ownerId: null, notes: "", order: 1 },
        t3: { title: "Deliverable: partner proposal deck", done: false, ownerId: "m3", notes: "", order: 2 },
      }, kpis: [] },
    "mc-2-outreach": { track: "modula", order: 2, name: "Local Industry Outreach", timeframe: "Month 2–3", summary: "Map the market.",
      tasks: { t1: { title: "Visit every target office personally", done: false, ownerId: null, notes: "", order: 0 } },
      kpis: ["Target: 50–100 companies"] },
  },
  kpis: {
    "kpi-id-firms": { track: "modula", order: 1, label: "Interior design firms contacted", target: 100, current: 12, unit: "" },
    "kpi-partners": { track: "modula", order: 2, label: "Active design partners", target: 50, current: 3, unit: "" },
  },
  discussionPoints: {
    dp1: { text: "Roles & Responsibilities", resolved: false, notes: "", order: 0 },
    dp2: { text: "Resource Sharing", resolved: true, notes: "Agreed 60/40 split.", order: 1 },
  },
  roadmapMeta: {
    team: { members: [
      { id: "m1", name: "Alex Tan", color: "#8A9A7E" },
      { id: "m2", name: "Priya Nair", color: "#BE8C5C" },
      { id: "m3", name: "Wei Ling", color: "#7A8CA0" },
      { id: "m4", name: "Marcus Ong", color: "#B5533C" },
    ] },
  },
  updates: {},
  roadmapMembers: {
    "admin-uid": { isAdmin: true },
    "member-uid": { isAdmin: false },
  },
};

const collectionListeners = {};
const docListeners = {};
let autoId = 1;

function collSnapshot(name) {
  return { docs: Object.entries(store[name] || {}).map(([id, data]) => ({ id, data: () => data })) };
}
function docSnapshot(name, id) {
  const data = store[name]?.[id];
  return { exists: () => data !== undefined, data: () => data };
}
function notifyCollection(name) {
  (collectionListeners[name] || []).forEach((cb) => cb(collSnapshot(name)));
}
function notifyDoc(name, id) {
  (docListeners[name]?.[id] || []).forEach((cb) => cb(docSnapshot(name, id)));
}

function deepSet(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== "object" || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  const last = parts[parts.length - 1];
  if (value === DELETE_FIELD) delete cur[last];
  else cur[last] = value;
}

export function getFirestore() { return { name: "mock-db" }; }
export function collection(db, name) { return { type: "collection", name }; }
export function doc(db, name, id) { return { type: "doc", name, id }; }
export function deleteField() { return DELETE_FIELD; }

export function onSnapshot(ref, onNext) {
  if (ref.type === "collection") {
    collectionListeners[ref.name] = collectionListeners[ref.name] || new Set();
    collectionListeners[ref.name].add(onNext);
    queueMicrotask(() => onNext(collSnapshot(ref.name)));
    return () => collectionListeners[ref.name].delete(onNext);
  }
  docListeners[ref.name] = docListeners[ref.name] || {};
  docListeners[ref.name][ref.id] = docListeners[ref.name][ref.id] || new Set();
  docListeners[ref.name][ref.id].add(onNext);
  queueMicrotask(() => onNext(docSnapshot(ref.name, ref.id)));
  return () => docListeners[ref.name][ref.id].delete(onNext);
}

export function updateDoc(ref, patch) {
  store[ref.name] = store[ref.name] || {};
  store[ref.name][ref.id] = store[ref.name][ref.id] || {};
  for (const [path, value] of Object.entries(patch)) deepSet(store[ref.name][ref.id], path, value);
  notifyCollection(ref.name);
  notifyDoc(ref.name, ref.id);
  return Promise.resolve();
}

export function setDoc(ref, data) {
  store[ref.name] = store[ref.name] || {};
  store[ref.name][ref.id] = data;
  notifyCollection(ref.name);
  notifyDoc(ref.name, ref.id);
  return Promise.resolve();
}

export function addDoc(ref, data) {
  const id = `auto${autoId++}`;
  store[ref.name] = store[ref.name] || {};
  store[ref.name][id] = data;
  notifyCollection(ref.name);
  return Promise.resolve({ id });
}

export function deleteDoc(ref) {
  if (store[ref.name]) delete store[ref.name][ref.id];
  notifyCollection(ref.name);
  notifyDoc(ref.name, ref.id);
  return Promise.resolve();
}

// Test-only hook: lets the test harness simulate a REMOTE change (another
// teammate's write arriving via Firestore's live listener) without any local
// click/focus interaction, to isolate that scenario from a local user action.
if (typeof window !== "undefined") {
  window.__mockRemoteWrite = (collectionName, docId, patch) => {
    store[collectionName] = store[collectionName] || {};
    store[collectionName][docId] = store[collectionName][docId] || {};
    for (const [path, value] of Object.entries(patch)) deepSet(store[collectionName][docId], path, value);
    notifyCollection(collectionName);
    notifyDoc(collectionName, docId);
  };
}
