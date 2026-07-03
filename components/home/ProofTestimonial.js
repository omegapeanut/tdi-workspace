"use client";

import { useMode } from "@/lib/mode-context";
import { proofStats, testimonial, trustedBy } from "@/lib/content";

export default function ProofTestimonial() {
  const { mode } = useMode();
  const stats = proofStats[mode];
  const quote = testimonial[mode];
  const trust = trustedBy[mode];

  return (
    <div style={{ padding: "90px 64px", borderTop: "1px solid rgba(239,231,218,.1)", display: "flex", flexDirection: "column", gap: "64px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "40px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ font: "400 52px 'Cormorant Garamond', serif", color: "oklch(0.74 0.08 78)" }}>{stat.value}</span>
            <span style={{ font: "500 12px Manrope, sans-serif", letterSpacing: ".12em", color: "rgba(239,231,218,.55)" }}>{stat.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "64px", alignItems: "center", borderTop: "1px solid rgba(239,231,218,.1)", paddingTop: "64px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <span style={{ font: "italic 400 36px/1.35 'Cormorant Garamond', serif" }}>&quot;{quote.quote}&quot;</span>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={quote.avatar} alt="Client portrait" style={{ width: "44px", height: "44px", borderRadius: "99px", objectFit: "cover", border: "1px solid rgba(239,231,218,.2)" }} />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ font: "700 13.5px Manrope, sans-serif" }}>{quote.name}</span>
              <span style={{ font: "400 12px Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>{quote.role}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <span style={{ font: "500 11px Manrope, sans-serif", letterSpacing: ".24em", color: "rgba(239,231,218,.45)" }}>{trust.label}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 28px", font: "600 15px Manrope, sans-serif", color: "rgba(239,231,218,.4)" }}>
              {trust.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
          <span style={{ font: "400 11.5px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.4)", borderTop: "1px solid rgba(239,231,218,.12)", paddingTop: "14px" }}>
            BCA-registered · bizSAFE Level 3 · HDB-licensed renovation contractor
          </span>
        </div>
      </div>
    </div>
  );
}
