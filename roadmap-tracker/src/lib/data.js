import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "./firebase";

// ---------------------------------------------------------------------------
// Live subscriptions — each returns an unsubscribe function, for use in
// useEffect(() => subscribeX(setState), []).
// ---------------------------------------------------------------------------

export function subscribePhases(callback) {
  const q = query(collection(db, "phases"), orderBy("track"), orderBy("order"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeKpis(callback) {
  const q = query(collection(db, "kpis"), orderBy("track"), orderBy("order"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeDiscussionPoints(callback) {
  const q = query(collection(db, "discussionPoints"), orderBy("order"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function subscribeTeam(callback) {
  return onSnapshot(doc(db, "roadmapMeta", "team"), (snap) => {
    callback(snap.exists() ? snap.data().members || [] : []);
  });
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function updateTaskField(phaseId, taskId, field, value) {
  return updateDoc(doc(db, "phases", phaseId), {
    [`tasks.${taskId}.${field}`]: value,
  });
}

export function cycleTaskStatus(currentStatus) {
  const order = ["todo", "doing", "done"];
  const idx = order.indexOf(currentStatus);
  return order[(idx + 1) % order.length];
}

export function updateKpiCurrent(kpiId, current) {
  return updateDoc(doc(db, "kpis", kpiId), { current });
}

export function toggleDiscussionPoint(id, resolved) {
  return updateDoc(doc(db, "discussionPoints", id), { resolved });
}

export function updateDiscussionNotes(id, notes) {
  return updateDoc(doc(db, "discussionPoints", id), { notes });
}

export function setTeamMembers(members) {
  return setDoc(doc(db, "roadmapMeta", "team"), { members });
}

export function clearTaskOwner(phaseId, taskId) {
  return updateDoc(doc(db, "phases", phaseId), {
    [`tasks.${taskId}.ownerId`]: deleteField(),
  });
}
