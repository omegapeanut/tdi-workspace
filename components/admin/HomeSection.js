"use client";

import { useEffect, useState } from "react";
import { CARD } from "@/components/admin/AdminShell";
import { getHomeSettings, saveHomeSettings, getAllProjects, updateProject } from "@/lib/cms";
import { withBasePath } from "@/lib/basePath";

const inputStyle = { border: "1px solid rgba(34,28,21,.2)", background: "#fff", color: "#26221C", padding: "12px 14px", font: "400 13.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" };
const label = { font: "600 10.5px Manrope, sans-serif", letterSpacing: ".12em", color: "#8A8172" };

function HeroCard({ mode, hero, onChange, showAnnouncement, announcement, onAnnouncementChange }) {
  return (
    <div style={{ ...CARD, padding: "24px 26px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <span style={label}>HERO — {mode === "C" ? "COMMERCIAL (DEFAULT)" : "RESIDENTIAL"}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={withBasePath(hero.image)} alt={hero.imageAlt} style={{ height: "150px", width: "100%", objectFit: "cover", borderRadius: "3px" }} />
      <span style={{ font: "400 11px Manrope, sans-serif", color: "#A89C88" }}>{hero.image} — replace the file in /public to change</span>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={label}>HEADLINE — LIVE ON HOMEPAGE</span>
        <input type="text" value={hero.headline} onChange={(e) => onChange({ ...hero, headline: e.target.value })} style={inputStyle} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span style={label}>CTA BUTTON — LIVE ON HOMEPAGE</span>
        <input type="text" value={hero.ctaLabel} onChange={(e) => onChange({ ...hero, ctaLabel: e.target.value })} style={inputStyle} />
      </div>
      {showAnnouncement && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={label}>ANNOUNCEMENT BAR (BLANK = HIDDEN) — LIVE ON HOMEPAGE</span>
          <input type="text" value={announcement} onChange={(e) => onAnnouncementChange(e.target.value)} placeholder="e.g. CNY closure 17–21 Feb — replies may be slower" style={inputStyle} />
        </div>
      )}
    </div>
  );
}

export default function HomeSection({ showToast }) {
  const [home, setHome] = useState(null);
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    getHomeSettings().then(setHome);
    getAllProjects().then(setProjects);
  }, []);

  if (!home || !projects) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const saveHero = async (mode, next) => {
    const hero = { ...home.hero, [mode]: next };
    setHome({ ...home, hero });
    await saveHomeSettings({ hero });
    showToast("Homepage saved & live");
  };

  const saveAnnouncement = async (value) => {
    setHome({ ...home, announcement: value });
    await saveHomeSettings({ announcement: value });
    showToast("Announcement bar saved & live");
  };

  const featured = projects.filter((p) => p.status === "Featured").sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const moveFeatured = async (project, dir) => {
    const sameMode = featured.filter((p) => p.mode === project.mode);
    const idx = sameMode.findIndex((p) => p.id === project.id);
    const swapWith = sameMode[idx + dir];
    if (!swapWith) return;
    await Promise.all([
      updateProject(project.id, { order: swapWith.order }),
      updateProject(swapWith.id, { order: project.order }),
    ]);
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === project.id) return { ...p, order: swapWith.order };
        if (p.id === swapWith.id) return { ...p, order: project.order };
        return p;
      })
    );
    showToast("Featured order updated");
  };

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <HeroCard mode="C" hero={home.hero.C} onChange={(next) => saveHero("C", next)} showAnnouncement={false} />
        <HeroCard
          mode="R"
          hero={home.hero.R}
          onChange={(next) => saveHero("R", next)}
          showAnnouncement
          announcement={home.announcement}
          onAnnouncementChange={saveAnnouncement}
        />
      </div>

      <div style={{ ...CARD, padding: "24px 26px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <span style={label}>FEATURED PROJECTS — CLICK ← → TO REORDER</span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "10px" }}>
          {featured.map((f) => (
            <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(f.img)} alt={f.name} style={{ height: "90px", width: "100%", objectFit: "cover", borderRadius: "3px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "4px" }}>
                <span style={{ font: "600 10.5px Manrope, sans-serif", color: "#5C5546" }}>{f.name}</span>
                <span style={{ display: "flex", gap: "2px", font: "600 11px Manrope, sans-serif", color: "#8A8172" }}>
                  <span onClick={() => moveFeatured(f, -1)} style={{ cursor: "pointer", padding: "2px 5px", border: "1px solid rgba(34,28,21,.2)", borderRadius: "3px" }}>←</span>
                  <span onClick={() => moveFeatured(f, 1)} style={{ cursor: "pointer", padding: "2px 5px", border: "1px solid rgba(34,28,21,.2)", borderRadius: "3px" }}>→</span>
                </span>
              </div>
            </div>
          ))}
          {featured.length === 0 && <span style={{ color: "#8A8172", font: "400 13px Manrope, sans-serif" }}>No projects marked Featured yet — set some in the Projects section.</span>}
        </div>
      </div>
    </div>
  );
}
