"use client";

import { useEffect, useState } from "react";
import { CARD, PILL_BTN } from "@/components/admin/AdminShell";
import FormModal, { Field, TextInput, Select, TextArea } from "@/components/admin/FormModal";
import { getAllArticles, addArticle, updateArticle, ARTICLE_STATUS_ORDER, nextStatus, statusColor } from "@/lib/cms";
import { journalCategories } from "@/lib/articles";
import { withBasePath } from "@/lib/basePath";

function flattenBody(body) {
  return (body || []).map((b) => b.text).filter(Boolean).join("\n\n");
}

const emptyArticle = {
  slug: "",
  title: "",
  cat: "commercial",
  kicker: "",
  excerpt: "",
  meta: "",
  img: "",
  author: "TDI Studio",
  authorAvatar: "/images/team-1.jpg",
  breadcrumb: "← JOURNAL",
  status: "Draft",
  seo: 75,
  order: 0,
  bodyText: "",
};

export default function JournalSection({ showToast }) {
  const [articles, setArticles] = useState(null);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllArticles().then(setArticles);
  }, []);

  if (!articles) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const rows = articles.filter((a) => filter === "all" || a.cat === filter).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const cycleStatus = async (a) => {
    const status = nextStatus(a.status, ARTICLE_STATUS_ORDER);
    await updateArticle(a.id, { status });
    setArticles((prev) => prev.map((x) => (x.id === a.id ? { ...x, status } : x)));
    showToast(`${a.title} → ${status}`);
  };

  const openNew = () => setEditing({ ...emptyArticle, isNew: true });
  const openEdit = (a) => setEditing({ ...a, bodyText: flattenBody(a.body) });

  const save = async () => {
    setSaving(true);
    try {
      const { bodyText, isNew, id, ...rest } = editing;
      const body = bodyText
        .split("\n\n")
        .map((t) => t.trim())
        .filter(Boolean)
        .map((text) => ({ type: "p", text }));
      const data = { ...rest, body };
      if (isNew) {
        const maxOrder = Math.max(0, ...articles.map((x) => x.order ?? 0));
        const ref = await addArticle({ ...data, order: maxOrder + 1 });
        setArticles((prev) => [...prev, { id: ref.id, ...data, order: maxOrder + 1 }]);
        showToast("Article created");
      } else {
        await updateArticle(id, data);
        setArticles((prev) => prev.map((x) => (x.id === id ? { id, ...data } : x)));
        showToast("Article saved & live");
      }
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {journalCategories.map(([key, cLabel]) => {
            const active = key === filter;
            return (
              <span
                key={key}
                onClick={() => setFilter(key)}
                style={{ border: `1px solid ${active ? "#26221C" : "rgba(34,28,21,.25)"}`, background: active ? "#26221C" : "transparent", color: active ? "#fff" : "#26221C", borderRadius: "99px", padding: "8px 16px", font: "600 11.5px Manrope, sans-serif", cursor: "pointer" }}
              >
                {cLabel}
              </span>
            );
          })}
        </div>
        <button onClick={openNew} style={{ border: 0, background: "oklch(0.55 0.09 70)", color: "#fff", borderRadius: "2px", padding: "12px 20px", font: "600 11.5px Manrope, sans-serif", letterSpacing: ".06em", cursor: "pointer" }}>
          + NEW ARTICLE
        </button>
      </div>

      <div style={{ ...CARD, overflow: "auto" }}>
        <div style={{ minWidth: "760px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "70px 1.6fr .9fr .7fr .7fr 150px", gap: "14px", padding: "14px 22px", borderBottom: "1px solid rgba(34,28,21,.15)", font: "600 10.5px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172", alignItems: "center" }}>
            <span>COVER</span><span>TITLE</span><span>CATEGORY</span><span>STATUS</span><span>SEO</span><span>ACTIONS</span>
          </div>
          {rows.map((a) => (
            <div key={a.id} style={{ display: "grid", gridTemplateColumns: "70px 1.6fr .9fr .7fr .7fr 150px", gap: "14px", padding: "12px 22px", borderBottom: "1px solid rgba(34,28,21,.07)", font: "400 13px Manrope, sans-serif", alignItems: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(a.img)} alt={a.title} style={{ width: "56px", height: "42px", objectFit: "cover", borderRadius: "3px" }} />
              <span style={{ fontWeight: 600 }}>{a.title}</span>
              <span>{a.cat}</span>
              <span onClick={() => cycleStatus(a)} style={{ color: statusColor(a.status), fontWeight: 600, cursor: "pointer" }} title="Click to change status">
                {a.status}
              </span>
              <span style={{ color: a.seo >= 85 ? "oklch(0.55 0.09 70)" : "#8A8172", fontWeight: 600 }}>{a.seo}</span>
              <div style={{ display: "flex", gap: "6px", font: "600 11px Manrope, sans-serif" }}>
                <span onClick={() => openEdit(a)} style={PILL_BTN}>Edit</span>
              </div>
            </div>
          ))}
          {rows.length === 0 && <div style={{ padding: "20px 22px", color: "#8A8172" }}>No articles match.</div>}
        </div>
      </div>
      <span style={{ font: "400 12px Manrope, sans-serif", color: "#A89C88" }}>
        Live: only Published and Featured articles appear on the Journal page. Title edits go live instantly.
      </span>

      {editing && (
        <FormModal title={editing.isNew ? "New article" : `Edit — ${editing.title}`} onCancel={() => setEditing(null)} onSave={save} saving={saving}>
          <Field label="TITLE">
            <TextInput value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
          </Field>
          <Field label="SLUG (used in the URL)">
            <TextInput value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
          </Field>
          <Field label="CATEGORY">
            <Select
              value={editing.cat}
              onChange={(e) => setEditing({ ...editing, cat: e.target.value })}
              options={journalCategories.filter(([k]) => k !== "all")}
            />
          </Field>
          <Field label="KICKER">
            <TextInput value={editing.kicker} onChange={(e) => setEditing({ ...editing, kicker: e.target.value })} />
          </Field>
          <Field label="EXCERPT">
            <TextArea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
          </Field>
          <Field label="COVER IMAGE PATH">
            <TextInput value={editing.img} onChange={(e) => setEditing({ ...editing, img: e.target.value })} placeholder="/images/journal-example.jpg" />
          </Field>
          <Field label="BODY (paragraphs separated by a blank line — replaces rich formatting)">
            <TextArea rows={6} value={editing.bodyText} onChange={(e) => setEditing({ ...editing, bodyText: e.target.value })} />
          </Field>
          <Field label="SEO SCORE (0–100, manual)">
            <TextInput type="number" min="0" max="100" value={editing.seo} onChange={(e) => setEditing({ ...editing, seo: Number(e.target.value) })} />
          </Field>
          <Field label="STATUS">
            <Select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} options={ARTICLE_STATUS_ORDER.map((s) => [s, s])} />
          </Field>
        </FormModal>
      )}
    </div>
  );
}
