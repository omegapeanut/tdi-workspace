"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import CmsLoading from "@/components/CmsLoading";
import { getAboutSettings } from "@/lib/cms";
import { withBasePath } from "@/lib/basePath";

export default function AboutPage() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    getAboutSettings().then(setAbout);
  }, []);

  if (!about) {
    return (
      <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
        <Header />
        <CmsLoading />
      </div>
    );
  }

  const { story, stats, team, credentials, trustedByLogos } = about;
  const paragraphs = story.split("\n\n");

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <Header />

      <div className="px-page grid-2 stack-tablet" style={{ gap: "40px", padding: "clamp(48px, 8vw, 80px) 0", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>ABOUT THE STUDIO · EST. 2011</span>
          <h1 style={{ margin: 0, font: "italic 500 clamp(2.25rem, 3vw + 1.5rem, 4.25rem)/1.1 'Cormorant Garamond', serif" }}>Builders first, designers always.</h1>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ margin: 0, font: "400 15.5px/1.8 Manrope, sans-serif", color: "rgba(239,231,218,.7)" }}>
              {p}
            </p>
          ))}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath("/images/about-studio.jpg")} alt="TDI Workspace studio" style={{ height: "clamp(280px, 45vw, 560px)", width: "100%", objectFit: "cover", display: "block" }} />
      </div>

      <div className="grid-4" style={{ gap: "1px", background: "rgba(239,231,218,.12)", borderTop: "1px solid rgba(239,231,218,.12)", borderBottom: "1px solid rgba(239,231,218,.12)" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "#221C15", padding: "28px 20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ font: "400 clamp(1.75rem, 1.5vw + 1.25rem, 2.875rem) 'Cormorant Garamond', serif", color: "oklch(0.74 0.08 78)" }}>{stat.value}</span>
            <span style={{ font: "500 11.5px Manrope, sans-serif", letterSpacing: ".12em", color: "rgba(239,231,218,.55)" }}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="px-page" style={{ padding: "clamp(48px, 8vw, 90px) 0", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>THE PEOPLE</span>
          <h2 style={{ margin: 0, font: "italic 500 clamp(1.875rem, 2vw + 1.25rem, 3.125rem)/1.1 'Cormorant Garamond', serif" }}>Led by directors, not departments.</h2>
        </div>
        <div className="grid-3" style={{ gap: "22px" }}>
          {team.map((member) => (
            <div key={member.role} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(member.img)} alt={member.role} style={{ height: "clamp(260px, 40vw, 400px)", width: "100%", objectFit: "cover", display: "block", filter: "grayscale(35%)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ font: "italic 500 24px 'Cormorant Garamond', serif" }}>{member.name}</span>
                <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".16em", color: "oklch(0.74 0.08 78)" }}>{member.role}</span>
                <span style={{ font: "400 13px/1.6 Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>{member.bio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-page" style={{ background: "#EFE7DA", color: "#221C15", padding: "clamp(48px, 8vw, 90px) 0", display: "flex", flexDirection: "column", gap: "44px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.55 0.09 70)" }}>CREDENTIALS</span>
          <h2 style={{ margin: 0, font: "italic 500 clamp(1.875rem, 2vw + 1.25rem, 3.125rem)/1.1 'Cormorant Garamond', serif" }}>Licensed, insured, accountable.</h2>
        </div>
        <div className="grid-3" style={{ gap: "1px", background: "rgba(34,28,21,.14)", border: "1px solid rgba(34,28,21,.14)" }}>
          {credentials.map((c) => (
            <div key={c.title} style={{ background: "#EFE7DA", padding: "30px 28px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ font: "700 15px Manrope, sans-serif" }}>{c.title}</span>
              <span style={{ font: "400 13px/1.6 Manrope, sans-serif", color: "#5C5546" }}>{c.body}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap", borderTop: "1px solid rgba(34,28,21,.18)", paddingTop: "32px" }}>
          <span style={{ font: "500 11px Manrope, sans-serif", letterSpacing: ".2em", color: "#8A8172" }}>TRUSTED BY TEAMS AT</span>
          {trustedByLogos.map((n) => (
            <span key={n} style={{ font: "600 15px Manrope, sans-serif", color: "#8A8172" }}>{n}</span>
          ))}
        </div>
      </div>

      <div className="px-page stack-mobile" style={{ padding: "clamp(48px, 8vw, 80px) 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ font: "italic 500 36px 'Cormorant Garamond', serif" }}>Work with people who build what they draw.</span>
          <span style={{ font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>30 minutes, free, with a director — not a salesperson.</span>
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
