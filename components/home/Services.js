"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode-context";
import { services, servicesHeadline } from "@/lib/content";

export default function Services() {
  const { mode } = useMode();
  const items = services[mode];

  return (
    <div className="px-page" style={{ padding: "clamp(56px, 9vw, 110px) 0 clamp(56px, 9vw, 100px)", display: "flex", flexDirection: "column", gap: "56px", borderTop: "1px solid rgba(239,231,218,.1)" }}>
      <div className="stack-mobile" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>WHAT WE DO</span>
          <h2 style={{ margin: 0, font: "italic 500 clamp(2rem, 2vw + 1.5rem, 3.375rem)/1.1 'Cormorant Garamond', serif" }}>{servicesHeadline[mode]}</h2>
        </div>
        <Link href="/services" style={{ font: "500 13px Manrope, sans-serif", color: "rgba(239,231,218,.6)", borderBottom: "1px solid rgba(239,231,218,.35)", paddingBottom: "4px", textDecoration: "none" }}>
          All services →
        </Link>
      </div>
      <div className="grid-4" style={{ gap: "1px", background: "rgba(239,231,218,.12)", border: "1px solid rgba(239,231,218,.12)" }}>
        {items.map((item) => (
          <div key={item.n} style={{ background: "#221C15", padding: "34px 28px 40px", display: "flex", flexDirection: "column", gap: "14px", cursor: "pointer" }}>
            <span style={{ font: "400 30px 'Cormorant Garamond', serif", color: "oklch(0.74 0.08 78)" }}>{item.n}</span>
            <span style={{ font: "700 16px Manrope, sans-serif" }}>{item.title}</span>
            <span style={{ font: "400 13px/1.65 Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>{item.body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
