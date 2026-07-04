"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { withBasePath } from "@/lib/basePath";

export const NAV = [
  ["dashboard", "Dashboard"],
  ["home", "Homepage"],
  ["projects", "Projects"],
  ["journal", "Journal"],
  ["materials", "Materials"],
  ["services", "Services"],
  ["about", "About & Team"],
  ["media", "Media library"],
  ["seo", "SEO"],
  ["leads", "Leads"],
  ["users", "Users & roles"],
];

const TITLES = {
  dashboard: ["Dashboard", "This week at a glance", "/"],
  home: ["Homepage editor", "Hero headlines, CTA, announcement bar — edits go live instantly", "/"],
  projects: ["Projects", "Only Published / Featured projects show on the live site", "/projects"],
  journal: ["Journal", "Only Published / Featured articles show on the live site", "/journal"],
  materials: ["Material library", "Drives the live Materials page — hide or rename instantly", "/materials"],
  services: ["Services", "Names, descriptions and order drive the live Services page", "/services"],
  about: ["About & Team", "Studio story and team names drive the live About page", "/about"],
  media: ["Media library", "Images currently used across the site", "/"],
  seo: ["SEO", "Per-page title and description overrides", "/"],
  leads: ["Leads", "Every enquiry with its source and status", "/"],
  users: ["Users & roles", "Admin allow-list — managed via the Firebase console", "/admin/login"],
};

export default function AdminShell({ section, setSection, badges = {}, user, children }) {
  const [toast, setToast] = useState("");
  const [toastTimer, setToastTimer] = useState(null);

  const showToast = (msg) => {
    if (toastTimer) clearTimeout(toastTimer);
    setToast(msg);
    setToastTimer(setTimeout(() => setToast(""), 2600));
  };

  const [title, subtitle, liveLink] = TITLES[section];

  return (
    <div className="admin-shell" style={{ fontFamily: "Manrope, sans-serif", background: "#F4F0E8" }}>
      <div className="admin-sidebar" style={{ background: "#171310", color: "#EFE7DA", display: "flex", flexDirection: "column", padding: "26px 0", boxSizing: "border-box" }}>
        <div className="admin-sidebar-brand" style={{ display: "flex", alignItems: "baseline", gap: "8px", padding: "0 24px 24px" }}>
          <span style={{ font: "500 22px 'Cormorant Garamond', serif" }}>TDI</span>
          <span style={{ font: "600 9.5px Manrope, sans-serif", letterSpacing: ".3em", color: "oklch(0.74 0.08 78)" }}>ADMIN</span>
        </div>
        <div className="admin-sidebar-nav" style={{ display: "flex", flexDirection: "column", gap: "2px", padding: "0 12px" }}>
          {NAV.map(([key, label]) => {
            const active = key === section;
            return (
              <button
                key={key}
                onClick={() => setSection(key)}
                style={{
                  border: 0,
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  background: active ? "rgba(239,231,218,.12)" : "transparent",
                  color: active ? "#EFE7DA" : "rgba(239,231,218,.6)",
                  borderRadius: "3px",
                  padding: "11px 14px",
                  font: "600 12.5px Manrope, sans-serif",
                  cursor: "pointer",
                }}
              >
                <span>{label}</span>
                {badges[key] ? <span style={{ font: "600 10px Manrope, sans-serif", color: "oklch(0.74 0.08 78)" }}>{badges[key]}</span> : null}
              </button>
            );
          })}
        </div>
        <div className="admin-sidebar-footer" style={{ padding: "18px 24px 0", display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid rgba(239,231,218,.12)" }}>
          <a href={withBasePath("/")} style={{ font: "600 11.5px Manrope, sans-serif", letterSpacing: ".06em", color: "oklch(0.74 0.08 78)", textDecoration: "none" }}>
            ↗ VIEW LIVE SITE
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ width: "32px", height: "32px", borderRadius: "99px", background: "rgba(239,231,218,.15)", display: "flex", alignItems: "center", justifyContent: "center", font: "600 12px Manrope, sans-serif" }}>
              {user?.email?.[0]?.toUpperCase() || "A"}
            </span>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ font: "700 12px Manrope, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</span>
              <span onClick={() => signOut(auth)} style={{ font: "400 11px Manrope, sans-serif", color: "rgba(239,231,218,.45)", cursor: "pointer" }}>
                Sign out
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", color: "#26221C", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", padding: "22px clamp(16px, 4vw, 40px)", borderBottom: "1px solid rgba(34,28,21,.12)", background: "#FBF8F2" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span style={{ font: "italic 500 26px 'Cormorant Garamond', serif" }}>{title}</span>
            <span style={{ font: "400 12px Manrope, sans-serif", color: "#8A8172" }}>{subtitle}</span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span style={{ font: "500 11px Manrope, sans-serif", color: "#A89C88" }}>All edits save &amp; go live automatically</span>
            <a
              href={withBasePath(liveLink)}
              style={{ border: "1px solid rgba(34,28,21,.3)", color: "#26221C", borderRadius: "2px", padding: "11px 18px", font: "600 11.5px Manrope, sans-serif", letterSpacing: ".06em", textDecoration: "none", whiteSpace: "nowrap" }}
            >
              VIEW LIVE PAGE ↗
            </a>
          </div>
        </div>

        {typeof children === "function" ? children({ showToast }) : children}
      </div>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#26221C",
            color: "#EFE7DA",
            borderRadius: "99px",
            padding: "13px 26px",
            font: "600 12.5px Manrope, sans-serif",
            boxShadow: "0 14px 36px rgba(0,0,0,.35)",
            zIndex: 120,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

export const CARD = { background: "#FBF8F2", border: "1px solid rgba(34,28,21,.1)", borderRadius: "4px" };
export const PILL_BTN = { border: "1px solid rgba(34,28,21,.25)", background: "transparent", color: "#26221C", borderRadius: "99px", padding: "5px 12px", cursor: "pointer", font: "600 11px Manrope, sans-serif" };
