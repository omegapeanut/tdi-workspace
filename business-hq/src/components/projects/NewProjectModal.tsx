import { useState } from "react";
import { Modal } from "../common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { createEntity, logActivity } from "../../lib/mutations";
import type { Priority, Project } from "../../types";

export function NewProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile } = useAuth();
  const { departments, users, goals } = useData();
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState(profile?.departmentId ?? "");
  const [ownerId, setOwnerId] = useState(profile?.id ?? "");
  const [goalId, setGoalId] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  if (!profile) return null;

  async function submit() {
    if (!name.trim() || !profile) return;
    setSaving(true);
    const id = await createEntity<Project>(
      "hqProjects",
      {
        name: name.trim(), description: "", goalId: goalId || null, departmentId: departmentId || null,
        ownerId: ownerId || null, memberIds: ownerId ? [ownerId] : [], dueDate: dueDate ? new Date(dueDate).getTime() : null,
        budget: null, priority, projectStatus: "planning", risks: [],
      },
      profile.id,
    );
    await logActivity("project", id, profile.id, "created", `created "${name.trim()}"`);
    setName("");
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="New project">
      <div className="flex flex-col gap-3">
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-sage-400" />
        <div className="grid grid-cols-2 gap-3">
          <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
            <option value="">No department</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
            <option value="">No owner</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="none">No Priority</option>
          </select>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink-soft" />
        </div>
        <select value={goalId} onChange={(e) => setGoalId(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
          <option value="">Not linked to a goal</option>
          {goals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
        </select>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface-soft">Cancel</button>
          <button type="button" onClick={submit} disabled={saving || !name.trim()} className="rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white hover:bg-sage-700 disabled:opacity-50">
            {saving ? "Creating…" : "Create project"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
