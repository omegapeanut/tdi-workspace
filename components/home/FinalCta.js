"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode-context";
import { useHomeCms } from "@/lib/home-cms-context";

export default function FinalCta() {
  const { mode } = useMode();
  const { home } = useHomeCms();
  const cta = home.finalCta[mode];

  return (
    <div className="px-page" style={{ padding: "clamp(64px, 10vw, 120px) 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center", borderBottom: "1px solid rgba(239,231,218,.1)" }}>
      <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>{cta.kicker}</span>
      <h2 style={{ margin: 0, font: "italic 500 clamp(2.25rem, 3vw + 1.5rem, 4.25rem)/1.1 'Cormorant Garamond', serif", maxWidth: "860px" }}>{cta.headline}</h2>
      <p style={{ margin: 0, font: "400 15px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.65)", maxWidth: "520px" }}>{cta.body}</p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href={cta.primary.href}
          style={{ display: "inline-block", background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "16px 30px", font: "700 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}
        >
          {cta.primary.label}
        </Link>
        <Link
          href={cta.secondary.href}
          style={{ display: "inline-block", border: "1px solid rgba(239,231,218,.4)", background: "transparent", color: "#EFE7DA", borderRadius: "2px", padding: "16px 30px", font: "600 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}
        >
          {cta.secondary.label}
        </Link>
      </div>
    </div>
  );
}
