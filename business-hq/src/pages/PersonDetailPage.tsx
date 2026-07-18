import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card, SectionHeading } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { Avatar } from "../components/common/Avatar";
import { RolePill, StatusPill } from "../components/common/Pills";
import { ProgressBar } from "../components/common/ProgressRing";
import { Scorecard } from "../components/people/Scorecard";
import { computeScorecard } from "../lib/rollup";
import { updateEntity } from "../lib/mutations";
import { canManageUsers } from "../lib/permissions";
import { formatMetric } from "../lib/format";
import type { Role, User } from "../types";

export function PersonDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { users, departments, tasks, milestones, kpis, projects, loading } = useData();

  const person = users.find((u) => u.id === userId);

  if (!profile || loading) return null;
  if (!person) return <EmptyState icon="🔍" title="Person not found" />;

  const dept = departments.find((d) => d.id === person.departmentId);
  const manager = users.find((u) => u.id === person.managerId);
  const myTasks = tasks.filter((t) => t.ownerId === person.id && t.taskStatus !== "cancelled");
  const openTasks = myTasks.filter((t) => t.taskStatus !== "completed");
  const myProjects = projects.filter((p) => p.ownerId === person.id || p.memberIds.includes(person.id));
  const myKpis = kpis.filter((k) => k.ownerId === person.id);
  const scorecard = computeScorecard(person.id, tasks, milestones, kpis);
  const canEdit = canManageUsers(profile.role);

  async function patch(fields: Partial<User>) {
    await updateEntity<User>("hqUsers", person!.id, fields, profile!.id);
  }

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={() => navigate("/people")} className="w-fit text-sm font-semibold text-muted hover:text-ink">← All people</button>

      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={person.name} color={person.avatarColor} size="lg" />
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{person.name}</h1>
          <p className="mt-0.5 text-sm text-muted">{person.jobTitle || "Team member"}{dept && ` · ${dept.name}`}</p>
        </div>
        <div className="ml-auto">
          {canEdit ? (
            <select value={person.role} onChange={(e) => patch({ role: e.target.value as Role })} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm font-semibold">
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          ) : (
            <RolePill role={person.role} />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <SectionHeading title="Current Workload" subtitle={`${openTasks.length} open task${openTasks.length === 1 ? "" : "s"}`} />
            {openTasks.length === 0 ? <EmptyState icon="✓" title="All caught up" /> : (
              <div className="flex flex-col">
                {openTasks.slice(0, 8).map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-t border-line/70 py-2.5 first:border-t-0">
                    <span className="truncate text-sm font-semibold text-ink">{t.title}</span>
                    <StatusPill status={t.taskStatus} />
                  </div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <SectionHeading title="Current Projects" />
            {myProjects.length === 0 ? <EmptyState icon="📁" title="No projects yet" /> : (
              <div className="flex flex-wrap gap-2">
                {myProjects.map((p) => (
                  <button key={p.id} type="button" onClick={() => navigate(`/projects/${p.id}`)} className="rounded-full bg-surface-soft px-3 py-1.5 text-xs font-bold text-ink-soft hover:bg-sage-50 hover:text-sage-700">
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <SectionHeading title="KPI" />
            {myKpis.length === 0 ? <EmptyState icon="🎯" title="No KPIs assigned" /> : (
              <div className="flex flex-col gap-4">
                {myKpis.map((k) => (
                  <div key={k.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">{k.label}</span>
                      <span className="text-xs font-bold text-muted">{formatMetric(k.current, k.unit)} / {formatMetric(k.target, k.unit)}</span>
                    </div>
                    <ProgressBar pct={k.target > 0 ? (k.current / k.target) * 100 : 0} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <SectionHeading title="Scorecard" />
            <Scorecard result={scorecard} />
          </Card>
          <Card className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><span className="text-muted">Manager</span><span className="font-semibold text-ink">{manager?.name ?? "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted">Department</span><span className="font-semibold text-ink">{dept?.name ?? "—"}</span></div>
            <div className="flex justify-between items-center"><span className="text-muted">Availability</span>
              {canEdit || person.id === profile.id ? (
                <select value={person.availability} onChange={(e) => patch({ availability: e.target.value as User["availability"] })} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs">
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="away">Away</option>
                  <option value="off">Off</option>
                </select>
              ) : (
                <span className="font-semibold capitalize text-ink">{person.availability}</span>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
