"use client";

import { useEffect, useState } from "react";
import { CARD } from "@/components/admin/AdminShell";
import { getAllLeads, updateLead, LEAD_STATUS_ORDER, nextStatus, statusColor } from "@/lib/cms";

const FILTERS = ["all", ...LEAD_STATUS_ORDER];

export default function LeadsSection({ showToast }) {
  const [leads, setLeads] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAllLeads().then(setLeads);
  }, []);

  if (!leads) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const rows = leads
    .filter((l) => filter === "all" || (l.status || "New") === filter)
    .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));

  const cycle = async (l) => {
    const status = nextStatus(l.status || "New", LEAD_STATUS_ORDER);
    await updateLead(l.id, { status });
    setLeads((prev) => prev.map((x) => (x.id === l.id ? { ...x, status } : x)));
    showToast(`${l.name} → ${status}`);
  };

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <span
              key={f}
              onClick={() => setFilter(f)}
              style={{ border: `1px solid ${active ? "#26221C" : "rgba(34,28,21,.25)"}`, background: active ? "#26221C" : "transparent", color: active ? "#fff" : "#26221C", borderRadius: "99px", padding: "8px 16px", font: "600 11.5px Manrope, sans-serif", cursor: "pointer" }}
            >
              {f === "all" ? "All" : f}
            </span>
          );
        })}
      </div>

      <div style={{ ...CARD, overflow: "auto" }}>
        <div style={{ minWidth: "780px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr .8fr .8fr .9fr .8fr", gap: "12px", padding: "14px 22px", borderBottom: "1px solid rgba(34,28,21,.15)", font: "600 10.5px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172" }}>
            <span>NAME</span><span>PROJECT TYPE</span><span>BUDGET</span><span>SOURCE</span><span>TIMELINE</span><span>STATUS</span>
          </div>
          {rows.map((l) => (
            <div key={l.id} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr .8fr .8fr .9fr .8fr", gap: "12px", padding: "13px 22px", borderBottom: "1px solid rgba(34,28,21,.07)", font: "400 13px Manrope, sans-serif", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>{l.name}</span>
              <span>{l.type || "—"}</span>
              <span>{l.budget || "—"}</span>
              <span>{l.source || "—"}</span>
              <span>{l.timeline || "—"}</span>
              <span onClick={() => cycle(l)} style={{ color: statusColor(l.status || "New"), fontWeight: 600, cursor: "pointer" }} title="Click to change status">
                {l.status || "New"}
              </span>
            </div>
          ))}
          {rows.length === 0 && <div style={{ padding: "20px 22px", color: "#8A8172" }}>No leads in this status.</div>}
        </div>
      </div>
      <span style={{ font: "400 12px Manrope, sans-serif", color: "#A89C88" }}>
        Click a status to move a lead along the pipeline: New → Contacted → Proposal sent → Won. Source is set automatically from the contact form or calculator.
      </span>
    </div>
  );
}
