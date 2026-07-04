"use client";

import { doc, getDoc, setDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ---- settings/{home,about,services,seo} — single documents ----

export async function getHomeSettings() {
  const snap = await getDoc(doc(db, "settings", "home"));
  return snap.exists() ? snap.data() : null;
}

export async function saveHomeSettings(patch) {
  await setDoc(doc(db, "settings", "home"), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getAboutSettings() {
  const snap = await getDoc(doc(db, "settings", "about"));
  return snap.exists() ? snap.data() : null;
}

export async function saveAboutSettings(patch) {
  await setDoc(doc(db, "settings", "about"), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getServicesSettings() {
  const snap = await getDoc(doc(db, "settings", "services"));
  return snap.exists() ? snap.data() : null;
}

export async function saveServicesSettings(patch) {
  await setDoc(doc(db, "settings", "services"), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getSeoSettings() {
  const snap = await getDoc(doc(db, "settings", "seo"));
  return snap.exists() ? snap.data() : null;
}

export async function saveSeoSettings(patch) {
  await setDoc(doc(db, "settings", "seo"), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}

// ---- projects collection ----

export async function getAllProjects() {
  const snap = await getDocs(collection(db, "projects"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProject(data) {
  return addDoc(collection(db, "projects"), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateProject(id, patch) {
  await updateDoc(doc(db, "projects", id), { ...patch, updatedAt: serverTimestamp() });
}

export async function deleteProject(id) {
  await deleteDoc(doc(db, "projects", id));
}

// ---- articles collection ----

export async function getAllArticles() {
  const snap = await getDocs(collection(db, "articles"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addArticle(data) {
  return addDoc(collection(db, "articles"), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateArticle(id, patch) {
  await updateDoc(doc(db, "articles", id), { ...patch, updatedAt: serverTimestamp() });
}

// ---- materials collection ----

export async function getAllMaterials() {
  const snap = await getDocs(collection(db, "materials"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addMaterial(data) {
  return addDoc(collection(db, "materials"), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export async function updateMaterial(id, patch) {
  await updateDoc(doc(db, "materials", id), { ...patch, updatedAt: serverTimestamp() });
}

// ---- leads collection (admin read/update only; create happens from contact/calculator) ----

export async function getAllLeads() {
  const snap = await getDocs(collection(db, "leads"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateLead(id, patch) {
  await updateDoc(doc(db, "leads", id), patch);
}

// ---- admins collection (read-only in the app; managed via Firebase console) ----

export async function getAllAdmins() {
  const snap = await getDocs(collection(db, "admins"));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

// ---- view-model shaping for public pages ----

const LIVE_STATUSES = ["Published", "Featured"];

export function projectsForMode(projects, mode) {
  return projects
    .filter((p) => p.mode === mode && LIVE_STATUSES.includes(p.status))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function featuredProjectsForHome(projects, mode) {
  return projects
    .filter((p) => p.mode === mode && p.status === "Featured")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 3)
    .map((p) => ({ image: p.img, alt: p.alt, title: p.name, meta: `${p.tag} · ${p.meta}` }));
}

export function articlesLive(articles) {
  return articles.filter((a) => LIVE_STATUSES.includes(a.status)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function journalPreviewForMode(articles, mode) {
  const cat = mode === "C" ? "commercial" : "residential";
  return articlesLive(articles)
    .filter((a) => a.cat === cat)
    .slice(0, 3)
    .map((a) => ({ image: a.img, alt: a.title, kicker: a.kicker, title: a.title }));
}

export function materialsLive(materials) {
  return materials.filter((m) => !m.hidden).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export const LEAD_STATUS_ORDER = ["New", "Contacted", "Proposal sent", "Won ✓"];
export const PROJECT_STATUS_ORDER = ["Draft", "Published", "Featured", "Archived"];
export const ARTICLE_STATUS_ORDER = ["Draft", "Published", "Featured"];

export function nextStatus(current, order) {
  const i = order.indexOf(current);
  return order[(i + 1) % order.length];
}

export function statusColor(status) {
  if (status === "Featured" || status === "New" || status === "Won ✓") return "oklch(0.55 0.09 70)";
  if (status === "Draft" || status === "Scheduled" || status === "Archived") return "#A0522D";
  return "#8A8172";
}
