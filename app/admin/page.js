"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [leads, setLeads] = useState(null);
  const [leadsError, setLeadsError] = useState("");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/admin/login");
        return;
      }
      setUser(u);
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "leads"), orderBy("createdAt", "desc")));
        setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        setLeadsError(
          "Couldn't load leads — this account isn't in the admins allow-list yet. Add a document at admins/" +
            user.uid +
            " in the Firebase console to grant access."
        );
      }
    })();
  }, [user]);

  if (user === undefined) {
    return (
      <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.5)" }}>Checking session…</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="px-page" style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh", padding: "40px 0 64px", display: "flex", flexDirection: "column", gap: "32px" }}>
      <div className="stack-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "9px" }}>
            <span style={{ font: "500 24px 'Cormorant Garamond', serif" }}>TDI</span>
            <span style={{ font: "600 10px Manrope, sans-serif", letterSpacing: ".3em", color: "oklch(0.74 0.08 78)" }}>ADMIN</span>
          </div>
          <span style={{ font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>Signed in as {user.email}</span>
        </div>
        <button
          onClick={() => signOut(auth)}
          style={{ border: "1px solid rgba(239,231,218,.35)", background: "transparent", color: "#EFE7DA", borderRadius: "2px", padding: "12px 22px", font: "600 11.5px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer" }}
        >
          SIGN OUT
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h1 style={{ margin: 0, font: "italic 500 clamp(1.75rem, 2.5vw + 1rem, 2.5rem)/1.1 'Cormorant Garamond', serif" }}>Leads</h1>

        {leadsError && (
          <span style={{ font: "400 13px/1.6 Manrope, sans-serif", color: "#E08558" }}>{leadsError}</span>
        )}

        {!leadsError && leads === null && (
          <span style={{ font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.5)" }}>Loading leads…</span>
        )}

        {!leadsError && leads?.length === 0 && (
          <span style={{ font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.5)" }}>No enquiries yet.</span>
        )}

        {!leadsError && leads && leads.length > 0 && (
          <div style={{ overflowX: "auto", border: "1px solid rgba(239,231,218,.14)", borderRadius: "3px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", font: "400 13px Manrope, sans-serif", whiteSpace: "nowrap" }}>
              <thead>
                <tr style={{ background: "rgba(20,16,11,.6)", textAlign: "left" }}>
                  {["Name", "Contact", "Type", "Budget", "Timeline", "Status", "Received"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", font: "600 10.5px Manrope, sans-serif", letterSpacing: ".12em", color: "rgba(239,231,218,.5)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} style={{ borderTop: "1px solid rgba(239,231,218,.08)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{lead.name}</td>
                    <td style={{ padding: "12px 16px", color: "rgba(239,231,218,.7)" }}>{lead.email || lead.phone}</td>
                    <td style={{ padding: "12px 16px", color: "rgba(239,231,218,.7)" }}>{lead.type || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "rgba(239,231,218,.7)" }}>{lead.budget || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "rgba(239,231,218,.7)" }}>{lead.timeline || "—"}</td>
                    <td style={{ padding: "12px 16px", color: "oklch(0.74 0.08 78)" }}>{lead.status || "New"}</td>
                    <td style={{ padding: "12px 16px", color: "rgba(239,231,218,.5)" }}>
                      {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString("en-SG") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
