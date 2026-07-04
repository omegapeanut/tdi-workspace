"use client";

import { useEffect, useState } from "react";
import { CARD, PILL_BTN } from "@/components/admin/AdminShell";
import FormModal, { Field, TextInput, Select } from "@/components/admin/FormModal";
import { getAllMaterials, addMaterial, updateMaterial } from "@/lib/cms";
import { materialCategories } from "@/lib/materials";
import { withBasePath } from "@/lib/basePath";

const emptyMaterial = { name: "", tag: "", cat: "wood", desc: "", finish: "", care: "", img: "", hidden: false, order: 0 };

export default function MaterialsSection({ showToast }) {
  const [materials, setMaterials] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllMaterials().then(setMaterials);
  }, []);

  if (!materials) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const q = search.trim().toLowerCase();
  const rows = materials.filter((m) => !q || m.name.toLowerCase().includes(q)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const toggleHide = async (m) => {
    await updateMaterial(m.id, { hidden: !m.hidden });
    setMaterials((prev) => prev.map((x) => (x.id === m.id ? { ...x, hidden: !x.hidden } : x)));
    showToast(m.hidden ? "Material shown on live site" : "Material hidden from live site");
  };

  const openNew = () => setEditing({ ...emptyMaterial, isNew: true });
  const openEdit = (m) => setEditing({ ...m });

  const save = async () => {
    setSaving(true);
    try {
      if (editing.isNew) {
        const { isNew, ...data } = editing;
        const maxOrder = Math.max(0, ...materials.map((x) => x.order ?? 0));
        const ref = await addMaterial({ ...data, order: maxOrder + 1 });
        setMaterials((prev) => [...prev, { id: ref.id, ...data, order: maxOrder + 1 }]);
        showToast("Material created");
      } else {
        const { id, ...data } = editing;
        await updateMaterial(id, data);
        setMaterials((prev) => prev.map((x) => (x.id === id ? { id, ...data } : x)));
        showToast("Material saved & live");
      }
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search materials…"
          style={{ border: "1px solid rgba(34,28,21,.2)", background: "#fff", color: "#26221C", padding: "12px 16px", font: "400 13px Manrope, sans-serif", borderRadius: "2px", outline: "none", width: "280px", maxWidth: "100%" }}
        />
        <button onClick={openNew} style={{ border: 0, background: "oklch(0.55 0.09 70)", color: "#fff", borderRadius: "2px", padding: "12px 20px", font: "600 11.5px Manrope, sans-serif", letterSpacing: ".06em", cursor: "pointer" }}>
          + NEW MATERIAL
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {rows.map((m) => (
          <div key={m.id} style={{ ...CARD, overflow: "hidden", display: "flex", flexDirection: "column", opacity: m.hidden ? 0.5 : 1 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(m.img)} alt={m.name} style={{ height: "110px", width: "100%", objectFit: "cover" }} />
            <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ font: "700 13px Manrope, sans-serif" }}>{m.name}</span>
              <span style={{ font: "400 11px Manrope, sans-serif", color: "#8A8172" }}>{m.tag}</span>
              <div style={{ display: "flex", gap: "6px", font: "600 10.5px Manrope, sans-serif", marginTop: "4px" }}>
                <span onClick={() => openEdit(m)} style={{ ...PILL_BTN, padding: "4px 11px" }}>Edit</span>
                <span onClick={() => toggleHide(m)} style={{ ...PILL_BTN, padding: "4px 11px", color: "#A0522D" }}>{m.hidden ? "Show" : "Hide"}</span>
              </div>
            </div>
          </div>
        ))}
        {rows.length === 0 && <div style={{ color: "#8A8172" }}>No materials match.</div>}
      </div>
      <span style={{ font: "400 12px Manrope, sans-serif", color: "#A89C88" }}>Hidden materials disappear from the live Materials page instantly; renames go live too.</span>

      {editing && (
        <FormModal title={editing.isNew ? "New material" : `Edit — ${editing.name}`} onCancel={() => setEditing(null)} onSave={save} saving={saving}>
          <Field label="NAME">
            <TextInput value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </Field>
          <Field label="TAG (e.g. WOOD, MARBLE)">
            <TextInput value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} />
          </Field>
          <Field label="CATEGORY">
            <Select value={editing.cat} onChange={(e) => setEditing({ ...editing, cat: e.target.value })} options={materialCategories.filter(([k]) => k !== "all")} />
          </Field>
          <Field label="DESCRIPTION">
            <TextInput value={editing.desc} onChange={(e) => setEditing({ ...editing, desc: e.target.value })} />
          </Field>
          <Field label="FINISH">
            <TextInput value={editing.finish} onChange={(e) => setEditing({ ...editing, finish: e.target.value })} />
          </Field>
          <Field label="CARE">
            <TextInput value={editing.care} onChange={(e) => setEditing({ ...editing, care: e.target.value })} />
          </Field>
          <Field label="IMAGE PATH">
            <TextInput value={editing.img} onChange={(e) => setEditing({ ...editing, img: e.target.value })} placeholder="/images/material-example.jpg" />
          </Field>
        </FormModal>
      )}
    </div>
  );
}
