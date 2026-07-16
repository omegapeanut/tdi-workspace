import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card, SectionHeading } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { TaskRow } from "../components/tasks/TaskRow";
import { TaskDetailModal } from "../components/tasks/TaskDetailModal";
import { StatusPill, PriorityPill } from "../components/common/Pills";
import { overdueTasks, thisWeekTasks, waitingTasks, completedTasks, todaysTasks } from "../lib/select";
import { updateEntity } from "../lib/mutations";
import type { Task, TaskStatus } from "../types";

const BOARD_COLUMNS: TaskStatus[] = ["not_started", "planning", "in_progress", "waiting", "blocked", "review", "completed"];

export function MyTasksPage() {
  const { profile } = useAuth();
  const { users, tasks, projects, loading } = useData();
  const [view, setView] = useState<"list" | "board">("list");
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

  const mine = useMemo(() => (profile ? tasks.filter((t) => t.ownerId === profile.id && t.taskStatus !== "cancelled") : []), [tasks, profile]);

  if (!profile || loading) return null;

  const groups = [
    { key: "overdue", label: "Overdue", items: overdueTasks(tasks, profile.id) },
    { key: "today", label: "Today", items: todaysTasks(tasks, profile.id) },
    { key: "week", label: "This Week", items: thisWeekTasks(tasks, profile.id) },
    { key: "waiting", label: "Waiting", items: waitingTasks(tasks, profile.id) },
    { key: "completed", label: "Completed", items: completedTasks(tasks, profile.id).slice(0, 10) },
  ];

  async function toggleDone(task: Task, done: boolean) {
    await updateEntity<Task>("hqTasks", task.id, { taskStatus: done ? "completed" : "in_progress" }, profile!.id);
  }

  function projectName(t: Task) {
    return projects.find((p) => p.id === t.projectId)?.name;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">My Tasks</h1>
          <p className="mt-1 text-sm text-muted">{mine.filter((t) => t.taskStatus !== "completed").length} open task{mine.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex rounded-full border border-line bg-surface p-1">
          {(["list", "board"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${view === v ? "bg-sage-600 text-white" : "text-ink-soft"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === "list" ? (
        <div className="flex flex-col gap-6">
          {groups.map((g) => (
            <Card key={g.key}>
              <SectionHeading title={g.label} subtitle={`${g.items.length} task${g.items.length === 1 ? "" : "s"}`} />
              {g.items.length === 0 ? (
                <EmptyState icon="✓" title="Nothing here" />
              ) : (
                g.items.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    owner={users.find((u) => u.id === t.ownerId)}
                    onClick={() => setOpenTaskId(t.id)}
                    onToggleDone={(d) => toggleDone(t, d)}
                    showProject
                    projectName={projectName(t)}
                  />
                ))
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="scroll-thin flex gap-4 overflow-x-auto pb-2">
          {BOARD_COLUMNS.map((status) => {
            const items = mine.filter((t) => t.taskStatus === status);
            return (
              <div key={status} className="w-72 shrink-0">
                <div className="mb-2 flex items-center justify-between px-1">
                  <StatusPill status={status} />
                  <span className="text-xs font-bold text-muted">{items.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {items.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setOpenTaskId(t.id)}
                      className="rounded-xl border border-line bg-surface p-3 text-left shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
                    >
                      <div className="text-sm font-semibold text-ink">{t.title}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <PriorityPill priority={t.priority} />
                        {t.dueDate && <span className="text-[11px] text-muted">{new Date(t.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>}
                      </div>
                    </button>
                  ))}
                  {items.length === 0 && <div className="rounded-xl border border-dashed border-line py-6 text-center text-xs text-muted">Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskDetailModal task={openTask} onClose={() => setOpenTaskId(null)} />
    </div>
  );
}
