import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { ProgressBar } from "../components/common/ProgressRing";
import { IconChevronRight, IconPlus } from "../components/common/Icons";
import { Modal } from "../components/common/Modal";
import { goalProgress, childGoals, projectsForGoal, tasksForProject } from "../lib/rollup";
import { createEntity } from "../lib/mutations";
import { formatMetric } from "../lib/format";
import { canManageCompanyGoals, canManageDepartment } from "../lib/permissions";
import type { Goal, GoalLevel } from "../types";

function GoalNode({ goal, depth }: { goal: Goal; depth: number }) {
  const { goals, projects, milestones, tasks } = useData();
  const [open, setOpen] = useState(depth === 0);
  const navigate = useNavigate();
  const pct = goalProgress(goals, projects, milestones, tasks, goal.id);
  const kids = childGoals(goals, goal.id);
  const linkedProjects = projectsForGoal(projects, goal.id);
  const hasChildren = kids.length > 0 || linkedProjects.length > 0;

  return (
    <div style={{ marginLeft: depth * 22 }}>
      <div className="flex items-center gap-3 border-t border-line/70 py-3 first:border-t-0">
        {hasChildren ? (
          <button type="button" onClick={() => setOpen((o) => !o)} className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-muted hover:bg-surface-soft">
            <IconChevronRight className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`} />
          </button>
        ) : <span className="w-6 shrink-0" />}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-semibold text-ink">{goal.title}</span>
            {goal.level === "company" && <span className="rounded-full bg-clay-50 px-2 py-0.5 text-[10px] font-bold uppercase text-clay-600">Company</span>}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <ProgressBar pct={pct} className="max-w-[220px]" color={goal.level === "company" ? "var(--color-clay-500)" : "var(--color-sage-500)"} />
            <span className="text-xs font-bold text-muted">{pct}%</span>
          </div>
        </div>
        {goal.target > 0 && (
          <span className="hidden shrink-0 text-xs text-muted sm:inline">{formatMetric(goal.current, goal.unit)} / {formatMetric(goal.target, goal.unit)}</span>
        )}
      </div>
      {open && (
        <div>
          {kids.map((k) => <GoalNode key={k.id} goal={k} depth={depth + 1} />)}
          {linkedProjects.map((p) => {
            const projTasks = tasksForProject(tasks, p.id);
            const done = projTasks.filter((t) => t.taskStatus === "completed").length;
            return (
              <div key={p.id} style={{ marginLeft: (depth + 1) * 22 }} className="flex items-center gap-3 border-t border-line/70 py-2.5 first:border-t-0">
                <span className="w-6 shrink-0" />
                <button type="button" onClick={() => navigate(`/projects/${p.id}`)} className="flex-1 text-left text-sm font-semibold text-ink-soft hover:text-sage-700 hover:underline">
                  {p.name}
                </button>
                <span className="text-xs text-muted">{done}/{projTasks.length} tasks</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function GoalsPage() {
  const { profile } = useAuth();
  const { goals, departments, loading } = useData();
  const [createOpen, setCreateOpen] = useState(false);
  const [level, setLevel] = useState<GoalLevel>("company");
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [parentGoalId, setParentGoalId] = useState("");
  const [metricLabel, setMetricLabel] = useState("");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("%");

  if (!profile || loading) return null;

  const companyGoals = goals.filter((g) => g.level === "company");
  const canCreate = canManageCompanyGoals(profile.role) || canManageDepartment(profile, profile.departmentId);

  async function submit() {
    if (!title.trim()) return;
    await createEntity<Goal>(
      "hqGoals",
      {
        level, title: title.trim(), description: "", departmentId: level === "department" ? departmentId || null : null,
        parentGoalId: level === "department" ? parentGoalId || null : null, ownerId: profile!.id,
        metricLabel: metricLabel.trim() || "Progress", target: Number(target) || 100, current: 0, unit, dueDate: null,
      },
      profile!.id,
    );
    setTitle(""); setMetricLabel(""); setTarget("");
    setCreateOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Goals</h1>
          <p className="mt-1 text-sm text-muted">Company Goal → Department Goal → Project → Milestone → Task. Progress rolls up automatically.</p>
        </div>
        {canCreate && (
          <button type="button" onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-soft)] hover:bg-sage-700">
            <IconPlus className="h-4 w-4" /> New Goal
          </button>
        )}
      </div>

      <Card>
        {companyGoals.length === 0 ? (
          <EmptyState icon="🎯" title="No goals yet" hint="Start with a company-wide goal, then break it down by department." />
        ) : (
          companyGoals.map((g) => <GoalNode key={g.id} goal={g} depth={0} />)
        )}
      </Card>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New goal">
        <div className="flex flex-col gap-3">
          <div className="flex rounded-full border border-line bg-surface p-1 w-fit">
            {(["company", "department"] as GoalLevel[]).map((l) => (
              <button key={l} type="button" onClick={() => setLevel(l)} className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${level === l ? "bg-sage-600 text-white" : "text-ink-soft"}`}>{l}</button>
            ))}
          </div>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Increase Revenue 30%" className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-sage-400" />
          {level === "department" && (
            <div className="grid grid-cols-2 gap-3">
              <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                <option value="">Department…</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={parentGoalId} onChange={(e) => setParentGoalId(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                <option value="">Rolls up to…</option>
                {companyGoals.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            <input value={metricLabel} onChange={(e) => setMetricLabel(e.target.value)} placeholder="Metric (e.g. Leads)" className="col-span-2 rounded-xl border border-line bg-surface px-3 py-2 text-sm" />
            <input value={target} onChange={(e) => setTarget(e.target.value)} type="number" placeholder="Target" className="rounded-xl border border-line bg-surface px-3 py-2 text-sm" />
          </div>
          <select value={unit} onChange={(e) => setUnit(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
            <option value="%">%</option>
            <option value="$">$</option>
            <option value="">count</option>
          </select>
          <div className="mt-2 flex justify-end gap-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface-soft">Cancel</button>
            <button type="button" onClick={submit} disabled={!title.trim()} className="rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white hover:bg-sage-700 disabled:opacity-50">Create goal</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
