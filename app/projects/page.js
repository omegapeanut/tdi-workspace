"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import CmsLoading from "@/components/CmsLoading";
import SeoHead from "@/components/SeoHead";
import { useMode } from "@/lib/mode-context";
import { projectCategories } from "@/lib/projects";
import { getAllProjects, projectsForMode } from "@/lib/cms";
import { withBasePath } from "@/lib/basePath";

export default function ProjectsPage() {
  const { mode, isC, toC, toR } = useMode();
  const [cat, setCat] = useState("all");
  const [allProjects, setAllProjects] = useState(null);

  useEffect(() => {
    getAllProjects().then(setAllProjects);
  }, []);

  const cats = projectCategories[mode];
  const projects = allProjects ? projectsForMode(allProjects, mode).filter((p) => cat === "all" || p.catKey === cat) : [];

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <SeoHead />
      <Header />

      <div className="px-page" style={{ padding: "clamp(48px, 8vw, 72px) 0 clamp(28px, 5vw, 40px)", display: "flex", flexDirection: "column", gap: "34px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>PORTFOLIO</span>
            <h1 style={{ margin: 0, font: "italic 500 clamp(2.25rem, 4vw + 1rem, 4.75rem)/1.1 'Cormorant Garamond', serif" }}>The work.</h1>
          </div>
          <div style={{ display: "flex", border: "1px solid rgba(239,231,218,.35)", borderRadius: "2px", font: "600 12px Manrope, sans-serif", letterSpacing: ".1em" }}>
            <button
              onClick={() => { toC(); setCat("all"); }}
              style={{ border: 0, cursor: "pointer", padding: "13px 26px", background: isC ? "#EFE7DA" : "transparent", color: isC ? "#221C15" : "rgba(239,231,218,.8)", font: "inherit", letterSpacing: "inherit" }}
            >
              COMMERCIAL
            </button>
            <button
              onClick={() => { toR(); setCat("all"); }}
              style={{ border: 0, cursor: "pointer", padding: "13px 26px", background: !isC ? "#EFE7DA" : "transparent", color: !isC ? "#221C15" : "rgba(239,231,218,.8)", font: "inherit", letterSpacing: "inherit" }}
            >
              RESIDENTIAL
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {cats.map(([key, label]) => {
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

      {!allProjects ? (
        <CmsLoading />
      ) : (
        <div className="px-page" style={{ padding: "0 0 90px" }}>
          <div className="grid-3" style={{ gap: "26px 22px" }}>
            {projects.map((p) => (
              <Link key={p.id} href="/projects/view" style={{ display: "flex", flexDirection: "column", gap: "14px", textDecoration: "none", color: "#EFE7DA", cursor: "pointer" }}>
                <div style={{ overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={withBasePath(p.img)} alt={p.name} style={{ height: "380px", width: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                  <span style={{ font: "italic 500 23px 'Cormorant Garamond', serif" }}>{p.name}</span>
                  <span style={{ font: "600 10px Manrope, sans-serif", letterSpacing: ".16em", color: "oklch(0.74 0.08 78)", border: "1px solid rgba(214,168,96,.4)", borderRadius: "99px", padding: "5px 12px", whiteSpace: "nowrap" }}>
                    {p.tag}
                  </span>
                </div>
                <span style={{ font: "500 11.5px Manrope, sans-serif", letterSpacing: ".12em", color: "rgba(239,231,218,.5)" }}>{p.meta}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="px-page stack-mobile" style={{ padding: "clamp(48px, 8vw, 80px) 0", borderTop: "1px solid rgba(239,231,218,.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ font: "italic 500 36px 'Cormorant Garamond', serif" }}>Your project could be next.</span>
          <span style={{ font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>Walk us through your space — 30 minutes, no obligation.</span>
        </div>
        <Link href="/contact" style={{ display: "inline-block", background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "16px 30px", font: "700 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}>
          BOOK A FREE CONSULTATION
        </Link>
      </div>

      <SimpleFooter />
      <WhatsAppButton />
    </div>
  );
}
