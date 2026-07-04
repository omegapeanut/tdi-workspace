"use client";

import { useEffect, useState } from "react";
import { CARD } from "@/components/admin/AdminShell";
import { getSeoSettings, saveSeoSettings } from "@/lib/cms";

const PAGES = ["/", "/projects", "/services", "/process", "/journal", "/materials", "/about", "/calculator", "/contact"];
const inputStyle = { border: "1px solid rgba(34,28,21,.2)", background: "#fff", color: "#26221C", padding: "10px 12px", font: "400 13px Manrope, sans-serif", borderRadius: "2px", outline: "none" };

export default function SeoSection({ showToast }) {
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    getSeoSettings().then((s) => setSeo(s || { pages: {} }));
  }, []);

  if (!seo) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const pageMeta = (path) => seo.pages[path] || { title: "", description: "" };

  const update = (path, field, value) => {
    const pages = { ...seo.pages, [path]: { ...pageMeta(path), [field]: value } };
    setSeo({ ...seo, pages });
  };

  const save = async (path) => {
    await saveSeoSettings({ pages: seo.pages });
    showToast(`Saved metadata for ${path}`);
  };

  const missingCount = PAGES.filter((p) => !pageMeta(p).title || !pageMeta(p).description).length;

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px", maxWidth: "460px" }}>
        <div style={{ ...CARD, padding: "22px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ font: "400 34px 'Cormorant Garamond', serif", color: "oklch(0.55 0.09 70)" }}>{PAGES.length}</span>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172" }}>PAGES TRACKED</span>
        </div>
        <div style={{ ...CARD, padding: "22px 24px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ font: "400 34px 'Cormorant Garamond', serif", color: missingCount ? "#A0522D" : "oklch(0.55 0.09 70)" }}>{missingCount}</span>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172" }}>PAGES MISSING META</span>
        </div>
      </div>

      <div style={{ ...CARD, overflow: "auto" }}>
        <div style={{ minWidth: "640px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr 1.4fr 90px", gap: "14px", padding: "14px 22px", borderBottom: "1px solid rgba(34,28,21,.15)", font: "600 10.5px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172" }}>
            <span>PAGE</span><span>TITLE</span><span>DESCRIPTION</span><span></span>
          </div>
          {PAGES.map((path) => {
            const meta = pageMeta(path);
            return (
              <div key={path} style={{ display: "grid", gridTemplateColumns: "140px 1fr 1.4fr 90px", gap: "14px", padding: "12px 22px", borderBottom: "1px solid rgba(34,28,21,.07)", alignItems: "center" }}>
                <span style={{ font: "600 12px Manrope, sans-serif" }}>{path}</span>
                <input style={inputStyle} value={meta.title} onChange={(e) => update(path, "title", e.target.value)} placeholder="Page title" />
                <input style={inputStyle} value={meta.description} onChange={(e) => update(path, "description", e.target.value)} placeholder="Meta description" />
                <span onClick={() => save(path)} style={{ border: "1px solid rgba(34,28,21,.25)", borderRadius: "99px", padding: "6px 14px", cursor: "pointer", font: "600 11px Manrope, sans-serif", textAlign: "center" }}>
                  Save
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <span style={{ font: "400 12px Manrope, sans-serif", color: "#A89C88" }}>
        Editable title/description overrides only — no Search Console, Analytics or keyword-rank integration is connected in this build.
      </span>
    </div>
  );
}
