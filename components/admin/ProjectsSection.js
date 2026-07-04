"use client";

import { useEffect, useState } from "react";
import { CARD, PILL_BTN } from "@/components/admin/AdminShell";
import FormModal, { Field, TextInput, Select } from "@/components/admin/FormModal";
import { getAllProjects, addProject, updateProject, PROJECT_STATUS_ORDER, nextStatus, statusColor } from "@/lib/cms";
import { withBasePath } from "@/lib/basePath";

const emptyProject = { name: "", mode: "C", tag: "", catKey: "", meta: "", img: "", alt: "", status: "Draft", order: 0 };

export default function ProjectsSection({ showToast }) {
  const [projects, setProjects] = useState(null);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAllProjects().then(setProjects);
  }, []);

  if (!projects) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  const q = search.trim().toLowerCase();
  const rows = projects.filter((p) => !q || p.name.toLowerCase().includes(q)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const cycleStatus = async (p) => {
    const status = nextStatus(p.status, PROJECT_STATUS_ORDER);
    await updateProject(p.id, { status });
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, status } : x)));
    showToast(`${p.name} → ${status}`);
  };

  const openNew = () => setEditing({ ...emptyProject, isNew: true });
  const openEdit = (p) => setEditing({ ...p });
  const duplicate = async (p) => {
    const { id, ...rest } = p;
    const maxOrder = Math.max(0, ...projects.map((x) => x.order ?? 0));
    const ref = await addProject({ ...rest, name: `${p.name} (copy)`, status: "Draft", order: maxOrder + 1 });
    setProjects((prev) => [...prev, { id: ref.id, ...rest, name: `${p.name} (copy)`, status: "Draft", order: maxOrder + 1 }]);
    showToast("Project duplicated as Draft");
  };
  const archive = async (p) => {
    const status = p.status === "Archived" ? "Draft" : "Archived";
    await updateProject(p.id, { status });
    setProjects((prev) => prev.map((x) => (x.id === p.id ? { ...x, status } : x)));
    showToast(status === "Archived" ? "Project archived" : "Project restored to Draft");
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing.isNew) {
        const { isNew, ...data } = editing;
        const maxOrder = Math.max(0, ...projects.map((x) => x.order ?? 0));
        const ref = await addProject({ ...data, order: maxOrder + 1 });
        setProjects((prev) => [...prev, { id: ref.id, ...data, order: maxOrder + 1 }]);
        showToast("Project created");
      } else {
        const { id, ...data } = editing;
        await updateProject(id, data);
        setProjects((prev) => prev.map((x) => (x.id === id ? { id, ...data } : x)));
        showToast("Project saved & live");
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
          placeholder="Search projects…"
          style={{ border: "1px solid rgba(34,28,21,.2)", background: "#fff", color: "#26221C", padding: "12px 16px", font: "400 13px Manrope, sans-serif", borderRadius: "2px", outline: "none", width: "280px", maxWidth: "100%" }}
        />
        <button onClick={openNew} style={{ border: 0, background: "oklch(0.55 0.09 70)", color: "#fff", borderRadius: "2px", padding: "12px 20px", font: "600 11.5px Manrope, sans-serif", letterSpacing: ".06em", cursor: "pointer" }}>
          + NEW PROJECT
        </button>
      </div>

      <div style={{ ...CARD, overflow: "auto" }}>
        <div style={{ minWidth: "720px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "70px 1.4fr .8fr .8fr .8fr 200px", gap: "14px", padding: "14px 22px", borderBottom: "1px solid rgba(34,28,21,.15)", font: "600 10.5px Manrope, sans-serif", letterSpacing: ".1em", color: "#8A8172", alignItems: "center" }}>
            <span>IMAGE</span><span>PROJECT</span><span>MODE</span><span>CATEGORY</span><span>STATUS</span><span>ACTIONS</span>
          </div>
          {rows.map((p) => (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "70px 1.4fr .8fr .8fr .8fr 200px", gap: "14px", padding: "12px 22px", borderBottom: "1px solid rgba(34,28,21,.07)", font: "400 13px Manrope, sans-serif", alignItems: "center", opacity: p.status === "Archived" ? 0.5 : 1 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={withBasePath(p.img)} alt={p.name} style={{ width: "56px", height: "42px", objectFit: "cover", borderRadius: "3px" }} />
              <span style={{ fontWeight: 600 }}>{p.name}</span>
              <span>{p.mode === "C" ? "Commercial" : "Residential"}</span>
              <span>{p.catKey}</span>
              <span onClick={() => cycleStatus(p)} style={{ color: statusColor(p.status), fontWeight: 600, cursor: "pointer" }} title="Click to change status">
                {p.status}
              </span>
              <div style={{ display: "flex", gap: "6px", font: "600 11px Manrope, sans-serif" }}>
                <span onClick={() => openEdit(p)} style={PILL_BTN}>Edit</span>
                <span onClick={() => duplicate(p)} style={PILL_BTN}>Duplicate</span>
                <span onClick={() => archive(p)} style={{ ...PILL_BTN, color: "#A0522D" }}>{p.status === "Archived" ? "Restore" : "Archive"}</span>
              </div>
            </div>
          ))}
          {rows.length === 0 && <div style={{ padding: "20px 22px", color: "#8A8172" }}>No projects match.</div>}
        </div>
      </div>
      <span style={{ font: "400 12px Manrope, sans-serif", color: "#A89C88" }}>
        Live: only Published and Featured projects appear on the Projects page. Click a status to cycle Draft → Published → Featured → Archived.
      </span>

      {editing && (
        <FormModal title={editing.isNew ? "New project" : `Edit — ${editing.name}`} onCancel={() => setEditing(null)} onSave={save} saving={saving}>
          <Field label="NAME">
            <TextInput value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
          </Field>
          <Field label="MODE">
            <Select
              value={editing.mode}
              onChange={(e) => setEditing({ ...editing, mode: e.target.value })}
              options={[
                ["C", "Commercial"],
                ["R", "Residential"],
              ]}
            />
          </Field>
          <Field label="TAG (e.g. OFFICE, HDB)">
            <TextInput value={editing.tag} onChange={(e) => setEditing({ ...editing, tag: e.target.value })} />
          </Field>
          <Field label="CATEGORY KEY (e.g. office, hdb)">
            <TextInput value={editing.catKey} onChange={(e) => setEditing({ ...editing, catKey: e.target.value })} />
          </Field>
          <Field label="META LINE">
            <TextInput value={editing.meta} onChange={(e) => setEditing({ ...editing, meta: e.target.value })} />
          </Field>
          <Field label="IMAGE PATH">
            <TextInput value={editing.img} onChange={(e) => setEditing({ ...editing, img: e.target.value })} placeholder="/images/project-example.jpg" />
          </Field>
          <Field label="STATUS">
            <Select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value })}
              options={PROJECT_STATUS_ORDER.map((s) => [s, s])}
            />
          </Field>
        </FormModal>
      )}
    </div>
  );
}
