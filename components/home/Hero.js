"use client";

import Link from "next/link";
import { useMode } from "@/lib/mode-context";
import { hero } from "@/lib/content";
import Header from "@/components/Header";
import ModeToggle from "@/components/ModeToggle";
import { withBasePath } from "@/lib/basePath";

export default function Hero() {
  const { mode } = useMode();
  const data = hero[mode];

  return (
    <div style={{ position: "relative", minHeight: "clamp(640px, 92vh, 860px)", display: "flex", flexDirection: "column" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBasePath(data.image)}
        alt={data.imageAlt}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(20,16,11,.94) 0%, rgba(20,16,11,.25) 45%, rgba(20,16,11,.6) 100%)",
        }}
      />
      <Header bordered={false} />

      <div className="px-page" style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 0 clamp(32px, 6vw, 56px)", gap: "clamp(24px, 4vw, 36px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>
            {data.kicker}
          </div>
          <h1 style={{ margin: 0, font: "italic 500 clamp(2.5rem, 4vw + 1.5rem, 5.875rem)/1.05 'Cormorant Garamond', serif", letterSpacing: "-.01em", maxWidth: "920px" }}>
            {data.headline}
          </h1>
          <p style={{ margin: 0, font: "400 15.5px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.72)", maxWidth: "520px" }}>
            {data.body}
          </p>
        </div>

        <div className="stack-mobile" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "24px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ alignSelf: "flex-start" }}>
              <ModeToggle />
            </div>
            <span style={{ font: "400 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.4)" }}>
              YOUR CHOICE IS REMEMBERED ON YOUR NEXT VISIT
            </span>
          </div>
          <div
            className="full-mobile"
            style={{
              background: "rgba(20,16,11,.65)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(239,231,218,.14)",
              borderRadius: "3px",
              padding: "22px 24px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              maxWidth: "330px",
            }}
          >
            <span style={{ font: "italic 500 17px 'Cormorant Garamond', serif" }}>A 30-minute conversation, no obligation.</span>
            <span style={{ font: "400 12.5px/1.6 Manrope, sans-serif", color: "rgba(239,231,218,.65)" }}>
              Walk us through your floor plan. We&apos;ll tell you what&apos;s possible — and what it should cost.
            </span>
            <Link
              href="/contact"
              style={{
                display: "inline-block",
                background: "oklch(0.74 0.08 78)",
                color: "#221C15",
                borderRadius: "2px",
                padding: "12px 18px",
                font: "700 11.5px Manrope, sans-serif",
                letterSpacing: ".08em",
                textDecoration: "none",
                alignSelf: "flex-start",
              }}
            >
              FREE CONSULTATION →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
