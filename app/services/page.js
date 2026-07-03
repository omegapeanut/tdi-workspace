"use client";

import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import ModeToggle from "@/components/ModeToggle";
import { useMode } from "@/lib/mode-context";
import { servicesData } from "@/lib/services";

export default function ServicesPage() {
  const { mode, isC } = useMode();
  const services = servicesData[mode];

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <Header />

      <div style={{ padding: "72px 64px 44px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>SERVICES</span>
          <h1 style={{ margin: 0, font: "italic 500 76px/1.05 'Cormorant Garamond', serif" }}>What we take on.</h1>
        </div>
        <ModeToggle />
      </div>

      <div style={{ padding: "0 64px 90px", display: "flex", flexDirection: "column" }}>
        {services.map((s) => (
          <div key={s.num} style={{ display: "grid", gridTemplateColumns: "80px 1.2fr 1fr 360px", gap: "40px", padding: "44px 0", borderTop: "1px solid rgba(239,231,218,.12)", alignItems: "start" }}>
            <span style={{ font: "400 40px 'Cormorant Garamond', serif", color: "oklch(0.74 0.08 78)" }}>{s.num}</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ font: "italic 500 32px 'Cormorant Garamond', serif" }}>{s.name}</span>
              <span style={{ font: "400 14px/1.75 Manrope, sans-serif", color: "rgba(239,231,218,.65)" }}>{s.desc}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px", font: "400 13px/1.5 Manrope, sans-serif", color: "rgba(239,231,218,.6)", paddingTop: "8px" }}>
              {s.items.map((it) => (
                <span key={it}>· {it}</span>
              ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt={s.name} style={{ height: "220px", width: "100%", objectFit: "cover", display: "block" }} />
          </div>
        ))}
      </div>

      <div style={{ padding: "80px 64px", borderTop: "1px solid rgba(239,231,218,.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ font: "italic 500 36px 'Cormorant Garamond', serif" }}>
            {isC ? "Scoping a commercial project?" : "Planning your renovation?"}
          </span>
          <span style={{ font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>
            A 30-minute conversation tells you what&apos;s possible — and what it should cost.
          </span>
        </div>
        <div style={{ display: "flex", gap: "14px" }}>
          <Link href="/contact" style={{ display: "inline-block", background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "16px 30px", font: "700 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}>
            BOOK A FREE CONSULTATION
          </Link>
          {!isC && (
            <Link href="/calculator" style={{ display: "inline-block", border: "1px solid rgba(239,231,218,.4)", color: "#EFE7DA", borderRadius: "2px", padding: "16px 30px", font: "600 12px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer", textDecoration: "none" }}>
              ESTIMATE COSTS FIRST
            </Link>
          )}
        </div>
      </div>

      <SimpleFooter />
      <WhatsAppButton />
    </div>
  );
}
