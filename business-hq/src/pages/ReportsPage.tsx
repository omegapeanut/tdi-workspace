import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card, SectionHeading } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { ProgressBar } from "../components/common/ProgressRing";
import { StatusPill } from "../components/common/Pills";
import { Avatar } from "../components/common/Avatar";
import { goalProgress, projectProgress, computeScorecard } from "../lib/rollup";
import { blockedTasks } from "../lib/select";
import { formatDate } from "../lib/format";
import { canViewReports } from "../lib/permissions";

export function ReportsPage() {
  const { profile } = useAuth();
  const { departments, goals, projects, milestones, tasks, users, kpis, loading } = useData();
  const navigate = useNavigate();

  if (!profile || loading) return null;
  if (!canViewReports(profile.role)) {
    return <EmptyState icon="🔒" title="Reports are for managers and above" hint="Ask an Owner or Admin if you need access." />;
  }

  const activeProjects = projects.filter((p) => p.projectStatus !== "cancelled");
  const missed = tasks
    .filter((t) => t.taskStatus !== "completed" && t.taskStatus !== "cancelled" && t.dueDate && t.dueDate < Date.now())
    .sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0));
  const upcomingMilestones = milestones
    .filter((m) => m.dueDate && m.dueDate >= Date.now())
    .sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0))
    .slice(0, 6);
  const blocked = blockedTasks(tasks);
  const topPerformers = [...users]
    .map((u) => ({ user: u, score: computeScorecard(u.id, tasks, milestones, kpis).score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Reports</h1>
        <p className="mt-1 text-sm text-muted">Company-wide view across departments, projects and people.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <SectionHeading title="Department Progress" />
          <div className="flex flex-col gap-4">
            {departments.map((d) => {
              const goal = goals.find((g) => g.level === "department" && g.departmentId === d.id);
              const pct = goal ? goalProgress(goals, projects, milestones, tasks, goal.id) : 0;
              return (
                <div key={d.id}>
                  <div className="mb-1 flex justify-between text-sm"><span className="font-semibold text-ink">{d.name}</span><span className="text-xs font-bold text-muted">{pct}%</span></div>
                  <ProgressBar pct={pct} color={d.color} />
                </div>
              );
            })}
            {departments.length === 0 && <EmptyState icon="🏢" title="No departments yet" />}
          </div>
        </Card>

        <Card>
          <SectionHeading title="Project Completion" />
          <div className="flex flex-col gap-4">
            {activeProjects.slice(0, 6).map((p) => {
              const pct = projectProgress(tasks, milestones, p.id);
              return (
                <div key={p.id}>
                  <div className="mb-1 flex justify-between text-sm"><span className="font-semibold text-ink">{p.name}</span><span className="text-xs font-bold text-muted">{pct}%</span></div>
                  <ProgressBar pct={pct} color="var(--color-clay-500)" />
                </div>
              );
            })}
            {activeProjects.length === 0 && <EmptyState icon="📁" title="No projects yet" />}
          </div>
        </Card>

        <Card>
          <SectionHeading title="Top Performers" subtitle="By weekly scorecard" />
          <div className="flex flex-col gap-3">
            {topPerformers.map(({ user, score }, i) => (
              <button key={user.id} type="button" onClick={() => navigate(`/people/${user.id}`)} className="flex items-center gap-3 text-left">
                <span className="w-4 text-xs font-bold text-muted">{i + 1}</span>
                <Avatar name={user.name} color={user.avatarColor} size="sm" />
                <span className="flex-1 truncate text-sm font-semibold text-ink">{user.name}</span>
                <span className="text-sm font-bold text-sage-600">{score}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionHeading title="Blocked Work" subtitle={`${blocked.length} task${blocked.length === 1 ? "" : "s"}`} />
          {blocked.length === 0 ? <EmptyState icon="✓" title="Nothing blocked" /> : (
            <div className="flex flex-col gap-2">
              {blocked.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between border-t border-line/70 py-2 first:border-t-0">
                  <span className="truncate text-sm text-ink">{t.title}</span>
                  <StatusPill status={t.taskStatus} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionHeading title="Missed Deadlines" subtitle={`${missed.length} overdue`} />
          {missed.length === 0 ? <EmptyState icon="✓" title="Nothing overdue" /> : (
            <div className="flex flex-col gap-2">
              {missed.slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center justify-between border-t border-line/70 py-2 first:border-t-0">
                  <span className="truncate text-sm text-ink">{t.title}</span>
                  <span className="text-xs font-bold text-danger-500">{formatDate(t.dueDate)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionHeading title="Upcoming Milestones" />
          {upcomingMilestones.length === 0 ? <EmptyState icon="🚩" title="Nothing upcoming" /> : (
            <div className="flex flex-col gap-2">
              {upcomingMilestones.map((m) => (
                <div key={m.id} className="flex items-center justify-between border-t border-line/70 py-2 first:border-t-0">
                  <span className="truncate text-sm text-ink">{m.title}</span>
                  <span className="text-xs font-bold text-muted">{formatDate(m.dueDate)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
