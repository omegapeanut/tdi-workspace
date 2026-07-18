import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { ProgressBar } from "../components/common/ProgressRing";
import { AvatarStack } from "../components/common/Avatar";
import { Modal } from "../components/common/Modal";
import { IconPlus } from "../components/common/Icons";
import { goalProgress } from "../lib/rollup";
import { createEntity } from "../lib/mutations";
import { canManageUsers } from "../lib/permissions";
import type { Department } from "../types";

const PALETTE = ["#8A9A7E", "#BE8C5C", "#7A93A8", "#B5533C", "#8B7CB0", "#5F8A6F"];

export function DepartmentsPage() {
  const { profile } = useAuth();
  const { departments, users, goals, projects, milestones, tasks, loading } = useData();
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");

  if (!profile || loading) return null;

  async function submit() {
    if (!name.trim()) return;
    await createEntity<Department>("hqDepartments", { name: name.trim(), leadId: null, color: PALETTE[departments.length % PALETTE.length] }, profile!.id);
    setName("");
    setCreateOpen(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Departments</h1>
          <p className="mt-1 text-sm text-muted">{departments.length} department{departments.length === 1 ? "" : "s"}</p>
        </div>
        {canManageUsers(profile.role) && (
          <button type="button" onClick={() => setCreateOpen(true)} className="flex items-center gap-1.5 rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-soft)] hover:bg-sage-700">
            <IconPlus className="h-4 w-4" /> New Department
          </button>
        )}
      </div>

      {departments.length === 0 ? (
        <EmptyState icon="🏢" title="No departments yet" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {departments.map((d) => {
            const members = users.filter((u) => u.departmentId === d.id);
            const lead = users.find((u) => u.id === d.leadId);
            const deptGoal = goals.find((g) => g.level === "department" && g.departmentId === d.id);
            const pct = deptGoal ? goalProgress(goals, projects, milestones, tasks, deptGoal.id) : 0;
            const openTasks = tasks.filter((t) => t.departmentId === d.id && t.taskStatus !== "completed" && t.taskStatus !== "cancelled").length;
            const blocked = tasks.filter((t) => t.departmentId === d.id && t.taskStatus === "blocked").length;

            return (
              <Card key={d.id} className="flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <h3 className="font-display text-lg font-semibold text-ink">{d.name}</h3>
                </div>
                <div className="text-xs text-muted">{members.length} member{members.length === 1 ? "" : "s"}{lead && ` · Led by ${lead.name}`}</div>
                {deptGoal && (
                  <div>
                    <div className="mb-1 flex justify-between text-xs"><span className="text-muted">{deptGoal.title}</span><span className="font-bold text-ink-soft">{pct}%</span></div>
                    <ProgressBar pct={pct} />
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-line/70 pt-3">
                  <AvatarStack names={members.map((m) => m.name)} colors={members.map((m) => m.avatarColor)} />
                  <div className="flex gap-3 text-xs text-muted">
                    <span>{openTasks} open</span>
                    {blocked > 0 && <span className="font-bold text-danger-500">{blocked} blocked</span>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New department">
        <div className="flex flex-col gap-3">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Department name" className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-sage-400" onKeyDown={(e) => e.key === "Enter" && submit()} />
          <div className="mt-1 flex justify-end gap-2">
            <button type="button" onClick={() => setCreateOpen(false)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface-soft">Cancel</button>
            <button type="button" onClick={submit} disabled={!name.trim()} className="rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white hover:bg-sage-700 disabled:opacity-50">Create</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
