"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSeoSettings } from "@/lib/cms";
import { resolveSeo, SITE_NAME, SITE_URL } from "@/lib/seo";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Commercial and residential interior design and build studio in Singapore.",
  areaServed: "Singapore",
};

// Renders nothing — applies title/meta/OG/canonical/JSON-LD to document.head.
// `dynamic` lets a detail page (e.g. a journal article) pass content-derived
// {title, description} that beats the static default but still loses to an
// admin override, and `articleJsonLd` adds Article structured data for posts.
export default function SeoHead({ dynamic, articleJsonLd }) {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    getSeoSettings().then((seo) => {
      if (cancelled) return;
      const rawPath = pathname || "/";
      // next.config.js sets trailingSlash: true, so usePathname() returns
      // "/journal/" rather than "/journal" — normalize before using it as a
      // PAGE_DEFAULTS/override lookup key, which are both keyed without the slash.
      const path = rawPath !== "/" && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
      const { title, description } = resolveSeo({ path, overrides: seo?.pages, dynamic });
      // Canonical URL still needs the trailing slash — that's the real,
      // redirect-free URL GitHub Pages serves (see scripts/generate-sitemap.mjs).
      const pathWithSlash = path === "/" ? "/" : `${path}/`;
      const canonicalUrl = `${SITE_URL}${pathWithSlash}${window.location.search}`;

      document.title = title;
      upsertMeta("name", "description", description);
      upsertMeta("property", "og:title", title);
      upsertMeta("property", "og:description", description);
      upsertMeta("property", "og:type", articleJsonLd ? "article" : "website");
      upsertMeta("property", "og:site_name", SITE_NAME);
      upsertMeta("property", "og:url", canonicalUrl);
      upsertMeta("name", "twitter:card", "summary_large_image");
      upsertMeta("name", "twitter:title", title);
      upsertMeta("name", "twitter:description", description);
      upsertLink("canonical", canonicalUrl);
      upsertJsonLd("ld-org", path === "/" ? ORG_JSON_LD : null);
      upsertJsonLd("ld-article", articleJsonLd || null);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname, dynamic, articleJsonLd]);

  return null;
}
