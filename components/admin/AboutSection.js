"use client";

import { useEffect, useState } from "react";
import { CARD, PILL_BTN } from "@/components/admin/AdminShell";
import FormModal, { Field, TextInput, TextArea } from "@/components/admin/FormModal";
import { getAboutSettings, saveAboutSettings, getHomeSettings, saveHomeSettings } from "@/lib/cms";
import { withBasePath } from "@/lib/basePath";

const label = { font: "600 11px Manrope, sans-serif", letterSpacing: ".18em", color: "#8A8172" };

export default function AboutSection({ showToast }) {
  const [about, setAbout] = useState(null);
  const [story, setStory] = useState("");
  const [home, setHome] = useState(null);
  const [editingTeamIdx, setEditingTeamIdx] = useState(null);
  const [teamDraft, setTeamDraft] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialDraft, setTestimonialDraft] = useState(null);

  useEffect(() => {
    getAboutSettings().then((a) => {
      setAbout(a);
      setStory(a.story);
    });
    getHomeSettings().then(setHome);
  }, []);

  if (!about || !home) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const saveStory = async () => {
    setAbout({ ...about, story });
    await saveAboutSettings({ story });
    showToast("Studio story saved & live");
  };

  const openTeamEdit = (idx) => {
    setEditingTeamIdx(idx);
    setTeamDraft({ ...about.team[idx] });
  };

  const saveTeam = async () => {
    const team = about.team.slice();
    team[editingTeamIdx] = teamDraft;
    setAbout({ ...about, team });
    await saveAboutSettings({ team });
    setEditingTeamIdx(null);
    showToast("Team member saved & live");
  };

  const saveTestimonial = async () => {
    const testimonial = { ...home.testimonial, [editingTestimonial]: testimonialDraft };
    setHome({ ...home, testimonial });
    await saveHomeSettings({ testimonial });
    setEditingTestimonial(null);
    showToast("Testimonial saved & live");
  };

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ ...CARD, padding: "24px 26px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={label}>STUDIO STORY — LIVE ON ABOUT PAGE</span>
          <textarea
            rows={8}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            onBlur={saveStory}
            style={{ border: "1px solid rgba(34,28,21,.2)", background: "#fff", color: "#26221C", padding: "14px 16px", font: "400 13.5px/1.7 Manrope, sans-serif", borderRadius: "2px", outline: "none", resize: "vertical" }}
          />
          <span style={{ font: "400 11px Manrope, sans-serif", color: "#A89C88" }}>Studio photo: /images/about-studio.jpg — replace the file to change. Saves when you click away.</span>
        </div>
        <div style={{ ...CARD, padding: "24px 26px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={label}>TEAM MEMBERS ({about.team.length}) — NAMES LIVE ON ABOUT PAGE</span>
          {about.team.map((t, idx) => (
            <div key={t.role} style={{ display: "flex", alignItems: "center", gap: "14px", border: "1px solid rgba(34,28,21,.12)", borderRadius: "3px", padding: "12px 16px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(t.img)} alt={t.role} style={{ width: "44px", height: "44px", borderRadius: "99px", objectFit: "cover" }} />
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
                <span style={{ font: "700 13px Manrope, sans-serif" }}>{t.name}</span>
                <span style={{ font: "400 11.5px Manrope, sans-serif", color: "#8A8172" }}>{t.role}</span>
              </div>
              <span onClick={() => openTeamEdit(idx)} style={PILL_BTN}>Edit</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...CARD, padding: "24px 26px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <span style={label}>TESTIMONIALS (2) — LIVE ON HOMEPAGE</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {["C", "R"].map((mode) => {
            const t = home.testimonial[mode];
            return (
              <div key={mode} style={{ border: "1px solid rgba(34,28,21,.12)", borderRadius: "3px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ font: "italic 400 14px/1.5 'Cormorant Garamond', serif" }}>&quot;{t.quote}&quot;</span>
                <span style={{ font: "600 11.5px Manrope, sans-serif", color: "#8A8172" }}>
                  {t.name} · {mode === "C" ? "Commercial" : "Residential"}
                </span>
                <span
                  onClick={() => {
                    setEditingTestimonial(mode);
                    setTestimonialDraft({ ...t });
                  }}
                  style={{ ...PILL_BTN, alignSelf: "flex-start" }}
                >
                  Edit
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {editingTeamIdx !== null && (
        <FormModal title={`Edit — ${teamDraft.role}`} onCancel={() => setEditingTeamIdx(null)} onSave={saveTeam}>
          <Field label="NAME">
            <TextInput value={teamDraft.name} onChange={(e) => setTeamDraft({ ...teamDraft, name: e.target.value })} />
          </Field>
          <Field label="ROLE">
            <TextInput value={teamDraft.role} onChange={(e) => setTeamDraft({ ...teamDraft, role: e.target.value })} />
          </Field>
          <Field label="BIO">
            <TextArea rows={3} value={teamDraft.bio} onChange={(e) => setTeamDraft({ ...teamDraft, bio: e.target.value })} />
          </Field>
        </FormModal>
      )}

      {editingTestimonial && (
        <FormModal title={`Edit testimonial — ${editingTestimonial === "C" ? "Commercial" : "Residential"}`} onCancel={() => setEditingTestimonial(null)} onSave={saveTestimonial}>
          <Field label="QUOTE">
            <TextArea rows={3} value={testimonialDraft.quote} onChange={(e) => setTestimonialDraft({ ...testimonialDraft, quote: e.target.value })} />
          </Field>
          <Field label="NAME">
            <TextInput value={testimonialDraft.name} onChange={(e) => setTestimonialDraft({ ...testimonialDraft, name: e.target.value })} />
          </Field>
          <Field label="ROLE / PROJECT">
            <TextInput value={testimonialDraft.role} onChange={(e) => setTestimonialDraft({ ...testimonialDraft, role: e.target.value })} />
          </Field>
        </FormModal>
      )}
    </div>
  );
}
