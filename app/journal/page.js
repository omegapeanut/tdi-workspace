"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import CmsLoading from "@/components/CmsLoading";
import { journalCategories } from "@/lib/articles";
import { getAllArticles, articlesLive } from "@/lib/cms";
import { withBasePath } from "@/lib/basePath";

export default function JournalPage() {
  const [cat, setCat] = useState("all");
  const [allArticles, setAllArticles] = useState(null);

  useEffect(() => {
    getAllArticles().then(setAllArticles);
  }, []);

  const live = allArticles ? articlesLive(allArticles) : [];
  const featuredArticle = live.find((a) => a.status === "Featured") || live[0];
  const posts = featuredArticle ? live.filter((p) => p.slug !== featuredArticle.slug && (cat === "all" || p.cat === cat)) : [];

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <Header />

      <div className="px-page" style={{ padding: "clamp(48px, 8vw, 72px) 0 clamp(28px, 5vw, 40px)", display: "flex", flexDirection: "column", gap: "26px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>THE JOURNAL</span>
          <h1 style={{ margin: 0, font: "italic 500 clamp(2.25rem, 4vw + 1rem, 4.75rem)/1.1 'Cormorant Garamond', serif" }}>Know before you renovate.</h1>
          <p style={{ margin: 0, font: "400 15.5px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.65)", maxWidth: "620px" }}>
            Guides, costs and honest advice from the people who do the work — written to answer the questions clients actually ask.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {journalCategories.map(([key, label]) => {
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

      {!allArticles ? (
        <CmsLoading />
      ) : (
        <>
          {featuredArticle && (
            <div className="px-page" style={{ padding: "16px 0 40px" }}>
              <Link
                href={`/journal/view?slug=${featuredArticle.slug}`}
                className="grid-journal-featured"
                style={{ textDecoration: "none", color: "#EFE7DA", border: "1px solid rgba(239,231,218,.14)", borderRadius: "3px", overflow: "hidden", cursor: "pointer" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={withBasePath(featuredArticle.img)} alt="Office fit-out costs featured article" style={{ height: "clamp(240px, 40vw, 400px)", width: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ background: "#1A150F", padding: "44px 44px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "18px" }}>
                  <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".2em", color: "oklch(0.74 0.08 78)" }}>{featuredArticle.kicker}</span>
                  <span style={{ font: "italic 500 38px/1.15 'Cormorant Garamond', serif" }}>{featuredArticle.title}</span>
                  <span style={{ font: "400 14px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>{featuredArticle.excerpt}</span>
                  <span style={{ font: "600 12px Manrope, sans-serif", letterSpacing: ".08em", color: "oklch(0.74 0.08 78)" }}>READ THE GUIDE →</span>
                </div>
              </Link>
            </div>
          )}

          <div className="px-page" style={{ padding: "0 0 90px" }}>
            <div className="grid-3" style={{ gap: "40px 22px" }}>
              {posts.map((p) => (
                <Link key={p.slug} href={`/journal/view?slug=${p.slug}`} style={{ display: "flex", flexDirection: "column", gap: "14px", textDecoration: "none", color: "#EFE7DA", cursor: "pointer" }}>
                  <div style={{ overflow: "hidden" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={withBasePath(p.img)} alt={p.title} style={{ height: "230px", width: "100%", objectFit: "cover", display: "block" }} />
                  </div>
                  <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".18em", color: "oklch(0.74 0.08 78)" }}>{p.kicker}</span>
                  <span style={{ font: "italic 500 24px/1.25 'Cormorant Garamond', serif" }}>{p.title}</span>
                  <span style={{ font: "400 13px/1.65 Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>{p.excerpt}</span>
                  <span style={{ font: "500 11.5px Manrope, sans-serif", color: "rgba(239,231,218,.4)" }}>{p.meta}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="px-page stack-mobile" style={{ padding: "clamp(48px, 8vw, 72px) 0", borderTop: "1px solid rgba(239,231,218,.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ font: "italic 500 32px 'Cormorant Garamond', serif" }}>One useful email a month.</span>
          <span style={{ font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>Cost benchmarks, new projects and renovation advice. No noise, unsubscribe anytime.</span>
        </div>
        <div style={{ display: "flex", gap: 0, width: "100%", maxWidth: "380px" }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{ border: "1px solid rgba(239,231,218,.35)", borderRight: 0, background: "transparent", color: "#EFE7DA", padding: "15px 20px", font: "400 13px Manrope, sans-serif", borderRadius: "2px 0 0 2px", flex: 1, minWidth: 0, outline: "none" }}
          />
          <button style={{ border: 0, background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "0 2px 2px 0", padding: "15px 26px", font: "700 12px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer", flexShrink: 0 }}>
            SUBSCRIBE
          </button>
        </div>
      </div>

      <SimpleFooter />
      <WhatsAppButton />
    </div>
  );
}
