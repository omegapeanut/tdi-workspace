"use client";

import { useEffect, useState } from "react";
import { CARD, PILL_BTN } from "@/components/admin/AdminShell";
import { getAllLeads, updateLead, getHomeSettings, saveHomeSettings, getAllProjects, getAllArticles, LEAD_STATUS_ORDER, nextStatus, statusColor } from "@/lib/cms";

function StatCard({ value, label }) {
  return (
    <div style={{ ...CARD, padding: "22px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
      <span style={{ font: "400 34px 'Cormorant Garamond', serif", color: "oklch(0.55 0.09 70)" }}>{value}</span>
      <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172" }}>{label}</span>
    </div>
  );
}

export default function DashboardSection({ showToast, navigate }) {
  const [leads, setLeads] = useState(null);
  const [projects, setProjects] = useState(null);
  const [articles, setArticles] = useState(null);
  const [home, setHome] = useState(null);
  const [hiatusOpen, setHiatusOpen] = useState(false);
  const [hiatusFrom, setHiatusFrom] = useState("");
  const [hiatusTo, setHiatusTo] = useState("");

  useEffect(() => {
    getAllLeads().then(setLeads);
    getAllProjects().then(setProjects);
    getAllArticles().then(setArticles);
    getHomeSettings().then(setHome);
  }, []);

  const cycleLeadStatus = async (lead) => {
    const status = nextStatus(lead.status, LEAD_STATUS_ORDER);
    await updateLead(lead.id, { status });
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    showToast("Lead status updated");
  };

  const saveHiatus = async () => {
    const hiatus = hiatusFrom && hiatusTo ? { from: hiatusFrom, to: hiatusTo } : null;
    await saveHomeSettings({ hiatus });
    setHome((prev) => ({ ...prev, hiatus }));
    setHiatusOpen(false);
    showToast(hiatus ? "Hiatus saved — showing on homepage" : "Hiatus cleared");
  };

  const clearHiatus = async () => {
    await saveHomeSettings({ hiatus: null });
    setHome((prev) => ({ ...prev, hiatus: null }));
    setHiatusFrom("");
    setHiatusTo("");
    showToast("Hiatus cleared");
  };

  if (!leads || !projects || !articles || !home) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = leads.filter((l) => l.createdAt?.toMillis && l.createdAt.toMillis() >= weekAgo).length;
  const featuredCount = projects.filter((p) => p.status === "Featured").length;
  const publishedArticles = articles.filter((a) => a.status === "Published" || a.status === "Featured").length;

  const quickLinks = [
    ["home", "Hero headline"],
    ["projects", "Add a project"],
    ["journal", "Write an article"],
    ["materials", "Add a material"],
    ["services", "Reorder services"],
    ["leads", "View all leads"],
  ];

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "28px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        <StatCard value={leads.length} label="TOTAL LEADS" />
        <StatCard value={newThisWeek} label="NEW LEADS THIS WEEK" />
        <StatCard value={featuredCount} label="FEATURED PROJECTS" />
        <StatCard value={publishedArticles} label="LIVE JOURNAL ARTICLES" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "14px" }}>
        <div style={{ ...CARD, padding: "24px 26px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".18em", color: "#8A8172" }}>LATEST LEADS — CLICK STATUS TO UPDATE</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr .8fr .7fr", gap: "12px", padding: "10px 0", borderBottom: "1px solid rgba(34,28,21,.15)", font: "600 10.5px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172" }}>
              <span>NAME</span><span>TYPE</span><span>BUDGET</span><span>STATUS</span>
            </div>
            {leads.slice(0, 5).map((l) => (
              <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr .8fr .7fr", gap: "12px", padding: "12px 0", borderBottom: "1px solid rgba(34,28,21,.08)", font: "400 13px Manrope, sans-serif", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{l.name}</span>
                <span>{l.type || "—"}</span>
                <span>{l.budget || "—"}</span>
                <span onClick={() => cycleLeadStatus(l)} style={{ color: statusColor(l.status), fontWeight: 600, cursor: "pointer" }} title="Click to change status">
                  {l.status || "New"}
                </span>
              </div>
            ))}
            {leads.length === 0 && <span style={{ padding: "16px 0", color: "#8A8172", font: "400 13px Manrope, sans-serif" }}>No leads yet.</span>}
          </div>
          <button onClick={() => navigate("leads")} style={{ ...PILL_BTN, borderRadius: "2px", padding: "10px 16px", alignSelf: "flex-start" }}>
            VIEW ALL LEADS →
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ ...CARD, padding: "24px 26px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".18em", color: "#8A8172" }}>QUICK EDIT</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {quickLinks.map(([key, label]) => (
                <button key={key} onClick={() => navigate(key)} style={{ ...PILL_BTN }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: "#26221C", color: "#EFE7DA", borderRadius: "4px", padding: "24px 26px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".18em", color: "oklch(0.74 0.08 78)" }}>COMPANY HIATUS</span>
            <span style={{ font: "400 12.5px/1.6 Manrope, sans-serif", color: "rgba(239,231,218,.65)" }}>
              {home.hiatus ? `Active: ${home.hiatus.from} to ${home.hiatus.to}` : "Not on hiatus."}
            </span>
            {hiatusOpen ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input type="date" value={hiatusFrom} onChange={(e) => setHiatusFrom(e.target.value)} style={{ flex: 1, border: "1px solid rgba(239,231,218,.3)", background: "rgba(20,16,11,.5)", color: "#EFE7DA", padding: "10px 12px", font: "400 12.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" }} />
                  <input type="date" value={hiatusTo} onChange={(e) => setHiatusTo(e.target.value)} style={{ flex: 1, border: "1px solid rgba(239,231,218,.3)", background: "rgba(20,16,11,.5)", color: "#EFE7DA", padding: "10px 12px", font: "400 12.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" }} />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={saveHiatus} style={{ border: 0, background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "10px 16px", font: "700 11px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer" }}>SAVE</button>
                  <button onClick={() => setHiatusOpen(false)} style={{ border: "1px solid rgba(239,231,218,.35)", background: "transparent", color: "#EFE7DA", borderRadius: "2px", padding: "10px 16px", font: "600 11px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer" }}>CANCEL</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setHiatusFrom(home.hiatus?.from || ""); setHiatusTo(home.hiatus?.to || ""); setHiatusOpen(true); }} style={{ border: "1px solid rgba(239,231,218,.35)", background: "transparent", color: "#EFE7DA", borderRadius: "2px", padding: "10px 16px", font: "600 11px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer" }}>
                  {home.hiatus ? "EDIT" : "SET HIATUS"}
                </button>
                {home.hiatus && (
                  <button onClick={clearHiatus} style={{ border: "1px solid rgba(239,231,218,.35)", background: "transparent", color: "rgba(239,231,218,.6)", borderRadius: "2px", padding: "10px 16px", font: "600 11px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer" }}>
                    CLEAR
                  </button>
                )}
              </div>
            )}
            <span style={{ font: "400 11px Manrope, sans-serif", color: "rgba(239,231,218,.4)" }}>While set, the homepage shows a notice bar automatically.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
