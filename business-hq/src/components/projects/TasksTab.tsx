import { useState } from "react";
import { Card, SectionHeading } from "../common/Card";
import { EmptyState } from "../common/EmptyState";
import { TaskRow } from "../tasks/TaskRow";
import { TaskDetailModal } from "../tasks/TaskDetailModal";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { createEntity, updateEntity } from "../../lib/mutations";
import type { Task } from "../../types";

export function TasksTab({ projectId }: { projectId: string }) {
  const { profile } = useAuth();
  const { tasks, milestones, users } = useData();
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  if (!profile) return null;

  const projectMilestones = milestones.filter((m) => m.projectId === projectId).sort((a, b) => a.order - b.order);
  const groups = [
    ...projectMilestones.map((m) => ({ key: m.id, label: m.title })),
    { key: "none", label: "No Milestone" },
  ];
  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

  async function addTask(milestoneKey: string) {
    const title = (drafts[milestoneKey] ?? "").trim();
    if (!title) return;
    await createEntity<Task>(
      "hqTasks",
      {
        title, description: "", projectId, milestoneId: milestoneKey === "none" ? null : milestoneKey, parentTaskId: null,
        departmentId: profile!.departmentId, ownerId: null, approverId: null, followerIds: [], collaboratorIds: [],
        priority: "none", taskStatus: "not_started", dueDate: null, estimatedHours: null, actualHours: null,
        tags: [], checklist: [], dependsOnTaskIds: [], repeat: "none", order: Date.now(),
      },
      profile!.id,
    );
    setDrafts((d) => ({ ...d, [milestoneKey]: "" }));
  }

  async function toggleDone(task: Task, done: boolean) {
    await updateEntity<Task>("hqTasks", task.id, { taskStatus: done ? "completed" : "in_progress" }, profile!.id);
  }

  return (
    <div className="flex flex-col gap-5">
      {groups.map((g) => {
        const items = tasks.filter((t) => t.projectId === projectId && t.taskStatus !== "cancelled" && !t.parentTaskId && (g.key === "none" ? !t.milestoneId : t.milestoneId === g.key));
        if (items.length === 0 && g.key === "none" && groups.length > 1) return null;
        return (
          <Card key={g.key}>
            <SectionHeading title={g.label} subtitle={`${items.length} task${items.length === 1 ? "" : "s"}`} />
            {items.length === 0 && <EmptyState icon="✓" title="No tasks yet" />}
            {items.map((t) => (
              <TaskRow key={t.id} task={t} owner={users.find((u) => u.id === t.ownerId)} onClick={() => setOpenTaskId(t.id)} onToggleDone={(d) => toggleDone(t, d)} />
            ))}
            <div className="mt-3 flex gap-2 border-t border-dashed border-line pt-3">
              <input
                value={drafts[g.key] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [g.key]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addTask(g.key)}
                placeholder="Add a task…"
                className="flex-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm outline-none focus:border-sage-400"
              />
              <button type="button" onClick={() => addTask(g.key)} className="rounded-lg border border-line px-3 text-sm font-semibold text-ink-soft hover:bg-surface-soft">Add</button>
            </div>
          </Card>
        );
      })}
      <TaskDetailModal task={openTask} onClose={() => setOpenTaskId(null)} />
    </div>
  );
}
