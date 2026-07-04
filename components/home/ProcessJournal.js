"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode-context";
import { processSteps, journalPreview } from "@/lib/content";
import { withBasePath } from "@/lib/basePath";

export default function ProcessJournal() {
  const { mode } = useMode();
  const articles = journalPreview[mode];

  return (
    <div style={{ background: "#EFE7DA", color: "#221C15", padding: "110px 64px 100px", display: "flex", flexDirection: "column", gap: "110px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "52px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.55 0.09 70)" }}>HOW IT WORKS · 六步交付</span>
          <h2 style={{ margin: 0, font: "italic 500 54px/1.1 'Cormorant Garamond', serif" }}>Six steps, no surprises.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "rgba(34,28,21,.14)", border: "1px solid rgba(34,28,21,.14)" }}>
          {processSteps.map((step) => (
            <div key={step.n} style={{ background: "#EFE7DA", padding: "30px 28px 36px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ font: "400 30px 'Cormorant Garamond', serif", color: "oklch(0.55 0.09 70)" }}>{step.n}</span>
              <span style={{ font: "700 15px Manrope, sans-serif" }}>{step.title}</span>
              <span style={{ font: "400 13px/1.6 Manrope, sans-serif", color: "#5C5546" }}>{step.body}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.55 0.09 70)" }}>FROM THE JOURNAL</span>
            <h2 style={{ margin: 0, font: "italic 500 54px/1.1 'Cormorant Garamond', serif" }}>Know before you renovate.</h2>
          </div>
          <Link href="/journal" style={{ font: "500 13px Manrope, sans-serif", color: "#5C5546", borderBottom: "1px solid rgba(34,28,21,.4)", paddingBottom: "4px", textDecoration: "none" }}>
            All articles →
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
          {articles.map((article) => (
            <div key={article.title} style={{ display: "flex", flexDirection: "column", gap: "14px", cursor: "pointer" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(article.image)} alt={article.alt} style={{ height: "220px", width: "100%", objectFit: "cover", display: "block" }} />
              <span style={{ font: "500 11px Manrope, sans-serif", letterSpacing: ".14em", color: "oklch(0.55 0.09 70)" }}>{article.kicker}</span>
              <span style={{ font: "italic 500 22px/1.25 'Cormorant Garamond', serif" }}>{article.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
