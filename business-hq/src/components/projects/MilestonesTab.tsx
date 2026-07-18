import { useState } from "react";
import { Card } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { ProgressRing } from "../common/ProgressRing";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { createEntity, updateEntity, softDeleteEntity } from "../../lib/mutations";
import { milestoneProgress, tasksForMilestone } from "../../lib/rollup";
import { formatDate } from "../../lib/format";
import type { Milestone } from "../../types";

export function MilestonesTab({ projectId }: { projectId: string }) {
  const { profile } = useAuth();
  const { milestones, tasks, users } = useData();
  const [title, setTitle] = useState("");
  const mine = milestones.filter((m) => m.projectId === projectId).sort((a, b) => a.order - b.order);

  if (!profile) return null;

  async function addMilestone() {
    if (!title.trim()) return;
    await createEntity<Milestone>(
      "hqMilestones",
      { projectId, title: title.trim(), order: mine.length, ownerId: null, dueDate: null, blocked: false, dependsOnMilestoneIds: [] },
      profile!.id,
    );
    setTitle("");
  }

  return (
    <div className="flex flex-col gap-4">
      {mine.length === 0 && <EmptyState icon="🚩" title="No milestones yet" hint="Break this project into visual checkpoints." />}
      {mine.map((m) => {
        const pct = milestoneProgress(tasks, m.id);
        const owner = users.find((u) => u.id === m.ownerId);
        const taskCount = tasksForMilestone(tasks, m.id).length;
        return (
          <Card key={m.id} className="flex items-center gap-4">
            <ProgressRing pct={pct} size={64} stroke={6} color={m.blocked ? "var(--color-danger-500)" : "var(--color-sage-500)"} label={`${pct}%`} />
            <div className="flex-1">
              <input
                defaultValue={m.title}
                onBlur={(e) => e.target.value.trim() && e.target.value !== m.title && updateEntity<Milestone>("hqMilestones", m.id, { title: e.target.value.trim() }, profile.id)}
                className="w-full border-none bg-transparent font-display text-lg font-semibold text-ink outline-none"
              />
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span>{taskCount} task{taskCount === 1 ? "" : "s"}</span>
                <select
                  value={m.ownerId ?? ""}
                  onChange={(e) => updateEntity<Milestone>("hqMilestones", m.id, { ownerId: e.target.value || null }, profile.id)}
                  className="rounded-md border border-line bg-surface px-1.5 py-0.5"
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <input
                  type="date"
                  defaultValue={m.dueDate ? new Date(m.dueDate).toISOString().slice(0, 10) : ""}
                  onChange={(e) => updateEntity<Milestone>("hqMilestones", m.id, { dueDate: e.target.value ? new Date(e.target.value).getTime() : null }, profile.id)}
                  className="rounded-md border border-line bg-surface px-1.5 py-0.5"
                />
                {m.dueDate && !m.blocked && <span>Due {formatDate(m.dueDate)}</span>}
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={m.blocked} onChange={(e) => updateEntity<Milestone>("hqMilestones", m.id, { blocked: e.target.checked }, profile.id)} className="accent-[var(--color-danger-500)]" />
                  Blocked
                </label>
              </div>
            </div>
            {owner && <span className="text-xs font-semibold text-ink-soft">{owner.name}</span>}
            <button type="button" onClick={() => softDeleteEntity("hqMilestones", m.id, profile.id)} className="text-xs font-semibold text-danger-500 hover:underline">Remove</button>
          </Card>
        );
      })}
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addMilestone()}
          placeholder="Add a milestone (e.g. Planning, Design, Launch)…"
          className="flex-1 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-sage-400"
        />
        <button type="button" onClick={addMilestone} className="rounded-xl border border-line px-4 text-sm font-semibold text-ink-soft hover:bg-surface-soft">Add</button>
      </div>
    </div>
  );
}
