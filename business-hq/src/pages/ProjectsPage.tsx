import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { ProjectStatusPill, PriorityPill } from "../components/common/Pills";
import { ProgressBar } from "../components/common/ProgressRing";
import { AvatarStack } from "../components/common/Avatar";
import { NewProjectModal } from "../components/projects/NewProjectModal";
import { IconPlus } from "../components/common/Icons";
import { projectProgress } from "../lib/rollup";
import { formatDate } from "../lib/format";
import { visibleDepartmentIds } from "../lib/permissions";

export function ProjectsPage() {
  const { profile } = useAuth();
  const { projects, tasks, milestones, users, departments, loading } = useData();
  const [createOpen, setCreateOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const navigate = useNavigate();

  if (!profile || loading) return null;

  const myDeptIds = visibleDepartmentIds(profile, departments.map((d) => d.id));
  const visible = projects.filter((p) => !p.departmentId || myDeptIds.includes(p.departmentId));
  const shown = (filter === "mine" ? visible.filter((p) => p.ownerId === profile.id || p.memberIds.includes(profile.id)) : visible)
    .filter((p) => p.projectStatus !== "cancelled")
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-muted">{shown.length} project{shown.length === 1 ? "" : "s"}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-line bg-surface p-1">
            {(["all", "mine"] as const).map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${filter === f ? "bg-sage-600 text-white" : "text-ink-soft"}`}>
                {f === "all" ? "All" : "Mine"}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-soft)] hover:bg-sage-700">
            <IconPlus className="h-4 w-4" /> New Project
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <EmptyState icon="📁" title="No projects yet" hint="Create your first project to start organizing milestones and tasks." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {shown.map((p) => {
            const pct = projectProgress(tasks, milestones, p.id);
            const dept = departments.find((d) => d.id === p.departmentId);
            const members = users.filter((u) => p.memberIds.includes(u.id) || u.id === p.ownerId);
            return (
              <Card key={p.id} onClick={() => navigate(`/projects/${p.id}`)} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink">{p.name}</h3>
                  <ProjectStatusPill status={p.projectStatus} />
                </div>
                {dept && <span className="text-xs font-semibold text-muted">{dept.name}</span>}
                <ProgressBar pct={pct} />
                <div className="flex items-center justify-between">
                  <PriorityPill priority={p.priority} />
                  <span className="text-xs text-muted">{p.dueDate ? `Due ${formatDate(p.dueDate)}` : "No due date"}</span>
                </div>
                <div className="flex items-center justify-between border-t border-line/70 pt-3">
                  <AvatarStack names={members.map((m) => m.name)} colors={members.map((m) => m.avatarColor)} />
                  <span className="text-xs font-bold text-sage-600">{pct}%</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <NewProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
