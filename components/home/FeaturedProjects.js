"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode-context";
import { featuredProjects } from "@/lib/content";
import { withBasePath } from "@/lib/basePath";

export default function FeaturedProjects() {
  const { mode } = useMode();
  const items = featuredProjects[mode];

  return (
    <div className="px-page" style={{ padding: "0 0 clamp(56px, 9vw, 110px)", display: "flex", flexDirection: "column", gap: "48px" }}>
      <div className="stack-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>SELECTED WORK</span>
          <h2 style={{ margin: 0, font: "italic 500 clamp(2rem, 2vw + 1.5rem, 3.375rem)/1.1 'Cormorant Garamond', serif" }}>Recent handovers.</h2>
        </div>
        <Link href="/projects" style={{ font: "500 13px Manrope, sans-serif", color: "rgba(239,231,218,.6)", borderBottom: "1px solid rgba(239,231,218,.35)", paddingBottom: "4px", textDecoration: "none" }}>
          All projects →
        </Link>
      </div>
      <div className="grid-featured" style={{ gap: "22px" }}>
        {items.map((project) => (
          <div key={project.title} style={{ display: "flex", flexDirection: "column", gap: "16px", cursor: "pointer" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(project.image)} alt={project.alt} style={{ height: "440px", width: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
              <span style={{ font: "italic 500 22px 'Cormorant Garamond', serif" }}>{project.title}</span>
              <span style={{ font: "500 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.5)" }}>{project.meta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
