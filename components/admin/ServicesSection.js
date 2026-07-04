"use client";

import { useEffect, useState } from "react";
import { CARD, PILL_BTN } from "@/components/admin/AdminShell";
import FormModal, { Field, TextInput, TextArea } from "@/components/admin/FormModal";
import { getServicesSettings, saveServicesSettings } from "@/lib/cms";

function ServiceList({ mode, label, items, onChange }) {
  const [editingIdx, setEditingIdx] = useState(null);
  const [draft, setDraft] = useState(null);

  const move = (idx, dir) => {
    const to = idx + dir;
    if (to < 0 || to >= items.length) return;
    const next = items.slice();
    const [it] = next.splice(idx, 1);
    next.splice(to, 0, it);
    onChange(next);
  };

  const openEdit = (idx) => {
    setEditingIdx(idx);
    setDraft({ ...items[idx] });
  };

  const save = () => {
    const next = items.slice();
    next[editingIdx] = draft;
    onChange(next);
    setEditingIdx(null);
  };

  return (
    <div style={{ ...CARD, padding: "24px 26px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".18em", color: "#8A8172" }}>{label} ({items.length})</span>
      {items.map((s, idx) => (
        <div key={s.name + idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", border: "1px solid rgba(34,28,21,.12)", borderRadius: "3px", padding: "13px 16px" }}>
          <span style={{ font: "600 13.5px Manrope, sans-serif" }}>{s.name}</span>
          <div style={{ display: "flex", gap: "6px", font: "600 11px Manrope, sans-serif", alignItems: "center" }}>
            <span onClick={() => openEdit(idx)} style={PILL_BTN}>Edit</span>
            <span onClick={() => move(idx, -1)} style={{ cursor: "pointer", color: "#8A8172", padding: "2px 6px" }} title="Move up">↑</span>
            <span onClick={() => move(idx, 1)} style={{ cursor: "pointer", color: "#8A8172", padding: "2px 6px" }} title="Move down">↓</span>
          </div>
        </div>
      ))}

      {editingIdx !== null && (
        <FormModal title={`Edit — ${items[editingIdx].name}`} onCancel={() => setEditingIdx(null)} onSave={save}>
          <Field label="NAME">
            <TextInput value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </Field>
          <Field label="DESCRIPTION">
            <TextArea rows={3} value={draft.desc} onChange={(e) => setDraft({ ...draft, desc: e.target.value })} />
          </Field>
          <Field label="IMAGE PATH">
            <TextInput value={draft.img} onChange={(e) => setDraft({ ...draft, img: e.target.value })} />
          </Field>
        </FormModal>
      )}
    </div>
  );
}

export default function ServicesSection({ showToast }) {
  const [services, setServices] = useState(null);

  useEffect(() => {
    getServicesSettings().then(setServices);
  }, []);

  if (!services) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const update = async (mode, items) => {
    const next = { ...services, [mode]: items };
    setServices(next);
    await saveServicesSettings({ [mode]: items });
    showToast("Services saved & live");
  };

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <ServiceList mode="C" label="COMMERCIAL SERVICES" items={services.C} onChange={(items) => update("C", items)} />
        <ServiceList mode="R" label="RESIDENTIAL SERVICES" items={services.R} onChange={(items) => update("R", items)} />
      </div>
      <span style={{ font: "400 12px Manrope, sans-serif", color: "#A89C88" }}>Renames and reordering go live on the Services page instantly. Order here = order on the live page.</span>
    </div>
  );
}
