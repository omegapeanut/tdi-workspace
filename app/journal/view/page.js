"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import { getArticleBySlug, featuredArticle, journalPosts } from "@/lib/articles";
import { withBasePath } from "@/lib/basePath";

function ArticleBlock({ block }) {
  if (block.type === "h2") {
    return <h2 style={{ margin: "18px 0 0", font: "italic 500 32px/1.2 'Cormorant Garamond', serif", color: "#EFE7DA" }}>{block.text}</h2>;
  }
  if (block.type === "quote") {
    return (
      <blockquote style={{ margin: "10px 0 0", borderLeft: "2px solid oklch(0.74 0.08 78)", padding: "6px 0 6px 26px", font: "italic 400 24px/1.5 'Cormorant Garamond', serif", color: "#EFE7DA" }}>
        {block.text}
      </blockquote>
    );
  }
  if (block.type === "table") {
    return (
      <div style={{ border: "1px solid rgba(239,231,218,.15)", borderRadius: "3px", overflow: "hidden", font: "400 14px Manrope, sans-serif" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.6fr", gap: "14px", padding: "14px 20px", background: "rgba(20,16,11,.6)", font: "600 10.5px Manrope, sans-serif", letterSpacing: ".12em", color: "rgba(239,231,218,.5)" }}>
          {block.headers.map((h) => (
            <span key={h}>{h}</span>
          ))}
        </div>
        {block.rows.map((row) => (
          <div key={row[0]} style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.6fr", gap: "14px", padding: "14px 20px", borderTop: "1px solid rgba(239,231,218,.08)" }}>
            <span style={{ fontWeight: 600 }}>{row[0]}</span>
            <span>{row[1]}</span>
            <span style={{ color: "rgba(239,231,218,.6)" }}>{row[2]}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <p style={{ margin: 0 }}>
      {block.strong && <strong style={{ color: "#EFE7DA" }}>{block.strong}</strong>}
      {block.text}
    </p>
  );
}

function ArticleContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || featuredArticle.slug;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="px-page" style={{ padding: "120px 0", textAlign: "center" }}>
        <p>Article not found.</p>
        <Link href="/journal" style={{ color: "oklch(0.74 0.08 78)" }}>← Back to journal</Link>
      </div>
    );
  }

  const related = journalPosts.filter((p) => p.slug !== article.slug).slice(0, 3);

  return (
    <>
      <div style={{ maxWidth: "820px", margin: "0 auto", padding: "72px 32px 40px", display: "flex", flexDirection: "column", gap: "22px" }}>
        <Link href="/journal" style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".2em", color: "rgba(239,231,218,.5)", textDecoration: "none" }}>
          {article.breadcrumb}
        </Link>
        <h1 style={{ margin: 0, font: "italic 500 clamp(1.875rem, 3.5vw + 1rem, 3.625rem)/1.1 'Cormorant Garamond', serif" }}>{article.title}</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", rowGap: "10px", flexWrap: "wrap", font: "500 12px Manrope, sans-serif", color: "rgba(239,231,218,.5)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath(article.authorAvatar)} alt="Author" style={{ width: "36px", height: "36px", borderRadius: "99px", objectFit: "cover", flexShrink: 0 }} />
          <span>{article.author}</span>
          <span>·</span>
          <span>{article.meta}</span>
          <span style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
            <span style={{ border: "1px solid rgba(239,231,218,.25)", borderRadius: "99px", padding: "6px 14px", cursor: "pointer" }}>Share</span>
            <span style={{ border: "1px solid rgba(239,231,218,.25)", borderRadius: "99px", padding: "6px 14px", cursor: "pointer" }}>Copy link</span>
          </span>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 32px" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={withBasePath(article.img)} alt={article.title} style={{ width: "100%", height: "440px", objectFit: "cover", display: "block" }} />
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "56px 32px 80px", display: "flex", flexDirection: "column", gap: "28px", font: "400 16px/1.9 Manrope, sans-serif", color: "rgba(239,231,218,.78)" }}>
        {article.body.map((block, i) => (
          <ArticleBlock key={i} block={block} />
        ))}

        <div className="stack-mobile" style={{ background: "rgba(20,16,11,.5)", border: "1px solid rgba(239,231,218,.14)", borderRadius: "3px", padding: "28px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginTop: "10px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ font: "italic 500 22px 'Cormorant Garamond', serif", color: "#EFE7DA" }}>Want a number for your floor plan?</span>
            <span style={{ font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>Send it over — a director returns a budget band in 5 working days.</span>
          </div>
          <Link href="/contact" style={{ border: 0, background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "14px 24px", font: "700 11.5px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none", whiteSpace: "nowrap" }}>
            REQUEST A PROPOSAL
          </Link>
        </div>
      </div>

      <div className="px-page" style={{ padding: "clamp(40px, 7vw, 64px) 0", borderTop: "1px solid rgba(239,231,218,.1)", display: "flex", flexDirection: "column", gap: "32px" }}>
        <span style={{ font: "italic 500 34px 'Cormorant Garamond', serif" }}>Related reading</span>
        <div className="grid-3" style={{ gap: "22px" }}>
          {related.map((r) => (
            <Link key={r.slug} href={`/journal/view?slug=${r.slug}`} style={{ display: "flex", flexDirection: "column", gap: "12px", textDecoration: "none", color: "#EFE7DA" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(r.img)} alt={r.title} style={{ height: "180px", width: "100%", objectFit: "cover", display: "block" }} />
              <span style={{ font: "italic 500 20px/1.3 'Cormorant Garamond', serif" }}>{r.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function ArticlePage() {
  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <Header />
      <Suspense fallback={null}>
        <ArticleContent />
      </Suspense>
      <SimpleFooter showAdmin />
    </div>
  );
}
