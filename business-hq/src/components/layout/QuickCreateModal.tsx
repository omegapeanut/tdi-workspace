import { useState } from "react";
import { Modal } from "../common/Modal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { createEntity, logActivity } from "../../lib/mutations";
import type { Task } from "../../types";

export function QuickCreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { profile } = useAuth();
  const { projects, users } = useData();
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [ownerId, setOwnerId] = useState(profile?.id ?? "");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);

  if (!profile) return null;

  async function submit() {
    if (!title.trim() || !profile) return;
    setSaving(true);
    const project = projects.find((p) => p.id === projectId);
    const id = await createEntity<Task>(
      "hqTasks",
      {
        title: title.trim(),
        description: "",
        projectId: projectId || null,
        milestoneId: null,
        parentTaskId: null,
        departmentId: project?.departmentId ?? profile.departmentId,
        ownerId: ownerId || null,
        approverId: null,
        followerIds: [],
        collaboratorIds: [],
        priority: "none",
        taskStatus: "not_started",
        dueDate: dueDate ? new Date(dueDate).getTime() : null,
        estimatedHours: null,
        actualHours: null,
        tags: [],
        checklist: [],
        dependsOnTaskIds: [],
        repeat: "none",
        order: Date.now(),
      },
      profile.id,
    );
    await logActivity("task", id, profile.id, "created", `created "${title.trim()}"`);
    setTitle("");
    setDueDate("");
    setSaving(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Quick create">
      <div className="flex flex-col gap-3">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to get done?"
          className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        />
        <div className="grid grid-cols-2 gap-3">
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
            <option value="">No project</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-soft"
        />
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface-soft">
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving || !title.trim()}
            className="rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-sage-700 disabled:opacity-50"
          >
            {saving ? "Creating…" : "Create task"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
