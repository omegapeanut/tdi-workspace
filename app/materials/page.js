"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import CmsLoading from "@/components/CmsLoading";
import SeoHead from "@/components/SeoHead";
import { materialCategories } from "@/lib/materials";
import { getAllMaterials, materialsLive } from "@/lib/cms";
import { withBasePath } from "@/lib/basePath";

export default function MaterialsPage() {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [favs, setFavs] = useState({});
  const [allMaterials, setAllMaterials] = useState(null);

  useEffect(() => {
    getAllMaterials().then(setAllMaterials);
  }, []);

  const q = query.trim().toLowerCase();
  const materials = allMaterials
    ? materialsLive(allMaterials)
        .filter((m) => cat === "all" || m.cat === cat)
        .filter((m) => !q || (m.name + " " + m.desc + " " + m.tag).toLowerCase().includes(q))
    : [];

  const favCount = Object.values(favs).filter(Boolean).length;
  const toggleFav = (id) => setFavs((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <SeoHead />
      <Header />

      <div className="px-page" style={{ padding: "clamp(48px, 8vw, 72px) 0 clamp(28px, 5vw, 40px)", display: "flex", flexDirection: "column", gap: "26px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>MATERIAL LIBRARY · 材料库</span>
            <h1 style={{ margin: 0, font: "italic 500 clamp(2.25rem, 4vw + 1rem, 4.75rem)/1.1 'Cormorant Garamond', serif" }}>Touch before you choose.</h1>
            <p style={{ margin: 0, font: "400 15.5px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.65)", maxWidth: "600px" }}>
              Every material we specify, in one place. Shortlist your favourites and bring the list to your consultation — the physical samples will be on the table.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", width: "100%", maxWidth: "280px" }}>
            <input
              type="text"
              placeholder="Search materials…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ border: "1px solid rgba(239,231,218,.3)", background: "transparent", color: "#EFE7DA", padding: "13px 18px", font: "400 13px Manrope, sans-serif", borderRadius: "2px", width: "100%", outline: "none" }}
            />
            <span style={{ font: "500 11.5px Manrope, sans-serif", color: "oklch(0.74 0.08 78)" }}>
              {favCount ? `♥ ${favCount} shortlisted` : "Tap ♡ to shortlist materials"}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {materialCategories.map(([key, label]) => {
            const active = key === cat;
            return (
              <button
                key={key}
                onClick={() => setCat(key)}
                style={{
                  border: `1px solid ${active ? "#EFE7DA" : "rgba(239,231,218,.3)"}`,
                  background: active ? "#EFE7DA" : "transparent",
                  color: active ? "#221C15" : "rgba(239,231,218,.7)",
                  borderRadius: "99px",
                  padding: "9px 20px",
                  font: "600 12px Manrope, sans-serif",
                  letterSpacing: ".06em",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {!allMaterials ? (
        <CmsLoading />
      ) : (
      <div className="px-page" style={{ padding: "0 0 90px" }}>
        <div className="grid-4" style={{ gap: "22px" }}>
          {materials.map((m) => (
            <div key={m.id} style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(239,231,218,.12)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBasePath(m.img)} alt={m.name} style={{ height: "200px", width: "100%", objectFit: "cover", display: "block" }} />
                <button
                  onClick={() => toggleFav(m.id)}
                  title="Shortlist"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    border: 0,
                    background: "rgba(20,16,11,.7)",
                    color: favs[m.id] ? "oklch(0.74 0.08 78)" : "rgba(239,231,218,.8)",
                    borderRadius: "99px",
                    width: "36px",
                    height: "36px",
                    font: "400 16px sans-serif",
                    cursor: "pointer",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {favs[m.id] ? "♥" : "♡"}
                </button>
              </div>
              <div style={{ padding: "20px 22px 24px", display: "flex", flexDirection: "column", gap: "10px", background: "#1A150F", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "10px" }}>
                  <span style={{ font: "italic 500 20px 'Cormorant Garamond', serif" }}>{m.name}</span>
                  <span style={{ font: "600 9.5px Manrope, sans-serif", letterSpacing: ".14em", color: "oklch(0.74 0.08 78)", whiteSpace: "nowrap" }}>{m.tag}</span>
                </div>
                <span style={{ font: "400 12.5px/1.6 Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>{m.desc}</span>
                <div style={{ display: "flex", justifyContent: "space-between", font: "500 11px Manrope, sans-serif", color: "rgba(239,231,218,.45)", borderTop: "1px solid rgba(239,231,218,.1)", paddingTop: "10px", marginTop: "auto" }}>
                  <span>{m.finish}</span>
                  <span>{m.care}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {materials.length === 0 && (
          <div style={{ padding: "60px 0", textAlign: "center", font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.45)" }}>
            No materials match — try a different search or category.
          </div>
        )}
      </div>
      )}

      <div className="px-page stack-mobile" style={{ padding: "clamp(48px, 8vw, 72px) 0", borderTop: "1px solid rgba(239,231,218,.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ font: "italic 500 32px 'Cormorant Garamond', serif" }}>
            {favCount ? `Your shortlist has ${favCount} material${favCount === 1 ? "" : "s"}.` : "Seen something you like?"}
          </span>
          <span style={{ font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>Bring your shortlist to a consultation — we&apos;ll have the physical samples ready.</span>
        </div>
        <Link href="/contact" style={{ display: "inline-block", background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "16px 30px", font: "700 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}>
          BOOK A CONSULTATION
        </Link>
      </div>

      <SimpleFooter />
      <WhatsAppButton />
    </div>
  );
}
