"use client";

import { useEffect, useState } from "react";
import { CARD } from "@/components/admin/AdminShell";
import { getAllAdmins } from "@/lib/cms";

export default function UsersSection() {
  const [admins, setAdmins] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllAdmins()
      .then(setAdmins)
      .catch(() => setError("Couldn't load the admin list — check that firestore.rules is deployed with the updated admins/ read rule."));
  }, []);

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <span style={{ font: "400 13px Manrope, sans-serif", color: "#8A8172" }}>
        Admin access is an allow-list: a document at admins/&#123;uid&#125; in Firestore, keyed by the Firebase Auth user ID. There is
        no invite flow here — add or remove admins from the Firebase console.
      </span>

      {error ? (
        <span style={{ font: "400 13px Manrope, sans-serif", color: "#A0522D" }}>{error}</span>
      ) : !admins ? (
        <div>Loading…</div>
      ) : (
        <div style={{ ...CARD, overflow: "auto" }}>
          <div style={{ minWidth: "480px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "12px", padding: "14px 22px", borderBottom: "1px solid rgba(34,28,21,.15)", font: "600 10.5px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172" }}>
              <span>EMAIL</span><span>UID</span>
            </div>
            {admins.map((a) => (
              <div key={a.uid} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "12px", padding: "13px 22px", borderBottom: "1px solid rgba(34,28,21,.07)", font: "400 13px Manrope, sans-serif" }}>
                <span style={{ fontWeight: 600 }}>{a.email || "(no email on file)"}</span>
                <span style={{ color: "#8A8172", fontSize: "11px", wordBreak: "break-all" }}>{a.uid}</span>
              </div>
            ))}
            {admins.length === 0 && <div style={{ padding: "20px 22px", color: "#8A8172" }}>No admin documents found.</div>}
          </div>
        </div>
      )}
    </div>
  );
}
