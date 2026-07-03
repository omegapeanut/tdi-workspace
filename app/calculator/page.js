"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { PROPERTY_TYPES, DESIGN_TIERS, SCOPE_ITEMS, DEFAULT_SCOPE, formatSgd, computeEstimate } from "@/lib/calculator";

const brassOn = { background: "#EFE7DA", color: "#221C15", borderColor: "#EFE7DA" };
const off = { background: "transparent", color: "rgba(239,231,218,.75)", borderColor: "rgba(239,231,218,.28)" };
const scopeOn = { background: "rgba(214,168,96,.14)", color: "#EFE7DA", borderColor: "oklch(0.74 0.08 78)" };

export default function CalculatorPage() {
  const [prop, setProp] = useState("hdbResale");
  const [rooms, setRooms] = useState(4);
  const [area, setArea] = useState(1000);
  const [tier, setTier] = useState("modern");
  const [scope, setScope] = useState(DEFAULT_SCOPE);

  const toggleScope = (key) => setScope((prev) => ({ ...prev, [key]: !prev[key] }));

  const { lo, hi, breakdown } = computeEstimate({ prop, tier, rooms, area, scope });
  const propLabel = PROPERTY_TYPES.find((p) => p[0] === prop)[1];
  const tierLabel = DESIGN_TIERS.find((t) => t[0] === tier)[1];
  const totalLabel = breakdown.length ? `${formatSgd(lo)} – ${formatSgd(hi)}` : "—";
  const summaryLine = `${propLabel} · ${rooms} rooms · ${area.toLocaleString("en-SG")} sqft · ${tierLabel} tier · ${breakdown.length} scope item${breakdown.length === 1 ? "" : "s"}`;

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <style>{`input[type=range]{accent-color:#D6A860}`}</style>
      <Header />

      <div style={{ padding: "72px 64px 44px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
        <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>RESIDENTIAL RENOVATION CALCULATOR · 预算估算</span>
        <h1 style={{ margin: 0, font: "italic 500 72px/1.05 'Cormorant Garamond', serif" }}>Know your number.</h1>
        <p style={{ margin: 0, font: "400 15.5px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.65)", maxWidth: "620px" }}>
          Five questions, two minutes — an honest cost range for your renovation, based on prevailing Singapore market rates. Estimates only; your consultation makes it exact.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: "32px", padding: "0 64px 80px", alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "44px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ font: "600 12px Manrope, sans-serif", letterSpacing: ".22em", color: "rgba(239,231,218,.55)" }}>1 — PROPERTY TYPE</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
              {PROPERTY_TYPES.map(([key, label, sub]) => (
                <button
                  key={key}
                  onClick={() => setProp(key)}
                  style={{ border: `1px solid ${prop === key ? brassOn.borderColor : off.borderColor}`, background: prop === key ? brassOn.background : off.background, color: prop === key ? brassOn.color : off.color, borderRadius: "3px", padding: "18px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", cursor: "pointer" }}
                >
                  <span style={{ font: "italic 500 19px 'Cormorant Garamond', serif" }}>{label}</span>
                  <span style={{ font: "500 10.5px Manrope, sans-serif", letterSpacing: ".08em", opacity: 0.65 }}>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ font: "600 12px Manrope, sans-serif", letterSpacing: ".22em", color: "rgba(239,231,218,.55)" }}>2 — ROOMS</span>
              <div style={{ display: "flex", alignItems: "center", gap: "18px", border: "1px solid rgba(239,231,218,.25)", borderRadius: "3px", padding: "12px 18px", alignSelf: "flex-start" }}>
                <button onClick={() => setRooms((r) => Math.max(1, r - 1))} style={{ border: 0, background: "transparent", color: "oklch(0.74 0.08 78)", font: "600 22px Manrope, sans-serif", cursor: "pointer", padding: "0 6px" }}>
                  −
                </button>
                <span style={{ font: "italic 500 26px 'Cormorant Garamond', serif", minWidth: "26px", textAlign: "center" }}>{rooms}</span>
                <button onClick={() => setRooms((r) => Math.min(8, r + 1))} style={{ border: 0, background: "transparent", color: "oklch(0.74 0.08 78)", font: "600 22px Manrope, sans-serif", cursor: "pointer", padding: "0 6px" }}>
                  +
                </button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ font: "600 12px Manrope, sans-serif", letterSpacing: ".22em", color: "rgba(239,231,218,.55)" }}>
                3 — FLOOR AREA · <span style={{ color: "oklch(0.74 0.08 78)" }}>{area.toLocaleString("en-SG")} SQFT</span>
              </span>
              <input type="range" min="300" max="4000" step="50" value={area} onChange={(e) => setArea(Number(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
              <div style={{ display: "flex", justifyContent: "space-between", font: "400 11px Manrope, sans-serif", color: "rgba(239,231,218,.4)" }}>
                <span>300 sqft</span>
                <span>4,000 sqft</span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ font: "600 12px Manrope, sans-serif", letterSpacing: ".22em", color: "rgba(239,231,218,.55)" }}>4 — DESIGN TIER</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px" }}>
              {DESIGN_TIERS.map(([key, label, sub]) => (
                <button
                  key={key}
                  onClick={() => setTier(key)}
                  style={{ border: `1px solid ${tier === key ? brassOn.borderColor : off.borderColor}`, background: tier === key ? brassOn.background : off.background, color: tier === key ? brassOn.color : off.color, borderRadius: "3px", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", cursor: "pointer" }}
                >
                  <span style={{ font: "italic 500 19px 'Cormorant Garamond', serif" }}>{label}</span>
                  <span style={{ font: "500 10.5px Manrope, sans-serif", letterSpacing: ".08em", opacity: 0.65 }}>{sub}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ font: "600 12px Manrope, sans-serif", letterSpacing: ".22em", color: "rgba(239,231,218,.55)" }}>5 — SCOPE OF WORK</span>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px" }}>
              {SCOPE_ITEMS.map(([key, label]) => {
                const on = scope[key];
                const style = on ? scopeOn : off;
                return (
                  <button
                    key={key}
                    onClick={() => toggleScope(key)}
                    style={{ border: `1px solid ${style.borderColor}`, background: style.background, color: style.color, borderRadius: "3px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", cursor: "pointer", textAlign: "left" }}
                  >
                    <span style={{ font: "600 13.5px Manrope, sans-serif" }}>{label}</span>
                    <span style={{ font: "400 12px Manrope, sans-serif", opacity: 0.6 }}>{on ? "✓ included" : "+ add"}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ position: "sticky", top: "24px", display: "flex", flexDirection: "column", border: "1px solid rgba(239,231,218,.18)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ background: "#1A150F", padding: "34px 34px 30px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".28em", color: "oklch(0.74 0.08 78)" }}>YOUR ESTIMATED RANGE</span>
            <span style={{ font: "italic 500 52px/1.05 'Cormorant Garamond', serif" }}>{totalLabel}</span>
            <span style={{ font: "400 12.5px/1.6 Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>{summaryLine}</span>
          </div>
          <div style={{ background: "#221C15", padding: "26px 34px", display: "flex", flexDirection: "column", gap: "13px", borderTop: "1px solid rgba(239,231,218,.12)" }}>
            {breakdown.length > 0 ? (
              breakdown.map((row) => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", gap: "16px", font: "400 13px Manrope, sans-serif" }}>
                  <span style={{ color: "rgba(239,231,218,.7)" }}>{row.label}</span>
                  <span style={{ color: "#EFE7DA", whiteSpace: "nowrap" }}>{row.range}</span>
                </div>
              ))
            ) : (
              <span style={{ font: "400 13px/1.6 Manrope, sans-serif", color: "rgba(239,231,218,.5)" }}>Select at least one scope of work to see your estimate.</span>
            )}
          </div>
          <div style={{ background: "#221C15", padding: "24px 34px 30px", display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid rgba(239,231,218,.12)" }}>
            <Link href="/contact" style={{ display: "block", textAlign: "center", background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "15px 24px", font: "700 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}>
              SEND THIS ESTIMATE — BOOK A CONSULTATION
            </Link>
            <button style={{ border: "1px solid rgba(239,231,218,.35)", background: "transparent", color: "#EFE7DA", borderRadius: "2px", padding: "14px 24px", font: "600 12px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer" }}>
              WHATSAPP US THIS RANGE
            </button>
            <span style={{ font: "400 11px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.4)" }}>
              Estimated ranges only, based on prevailing market rates and typical specifications. Not a quotation — final pricing depends on site condition, material selection and detailed scope. TDI Workspace never promises fixed prices before a site visit.
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: "64px", borderTop: "1px solid rgba(239,231,218,.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ font: "italic 500 32px 'Cormorant Garamond', serif" }}>Renovating a business space instead?</span>
          <span style={{ font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>Commercial projects are scoped personally — no calculators, just a proposal in 5 working days.</span>
        </div>
        <Link href="/contact" style={{ display: "inline-block", border: "1px solid oklch(0.74 0.08 78)", background: "transparent", color: "oklch(0.74 0.08 78)", borderRadius: "2px", padding: "15px 28px", font: "600 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}>
          REQUEST A COMMERCIAL PROPOSAL
        </Link>
      </div>

      <SimpleFooter />
      <WhatsAppButton />
    </div>
  );
}
