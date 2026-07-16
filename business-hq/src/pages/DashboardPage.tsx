import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card, SectionHeading } from "../components/common/Card";
import { ProgressRing, ProgressBar } from "../components/common/ProgressRing";
import { EmptyState } from "../components/common/EmptyState";
import { TaskRow } from "../components/tasks/TaskRow";
import { TaskDetailModal } from "../components/tasks/TaskDetailModal";
import { overallTaskProgress, projectProgress, goalProgress } from "../lib/rollup";
import { todaysTasks, overdueTasks, upcomingDeadlines } from "../lib/select";
import { formatDateLong, formatMetric, timeAgo, clampPct } from "../lib/format";
import { updateEntity } from "../lib/mutations";
import type { Task } from "../types";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

const KPI_RING_CATEGORIES = [
  { category: "sales" as const, label: "Sales Target", color: "var(--color-sage-500)" },
  { category: "marketing" as const, label: "Marketing Target", color: "var(--color-clay-500)" },
  { category: "development" as const, label: "Development Target", color: "var(--color-info-500)" },
  { category: "operations" as const, label: "Operations Target", color: "var(--color-violet-500)" },
];

export function DashboardPage() {
  const { profile } = useAuth();
  const { users, tasks, projects, goals, milestones, kpis, announcements, activity, loading } = useData();
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;

  const companyPct = useMemo(() => overallTaskProgress(tasks), [tasks]);
  const avgProjectCompletion = useMemo(() => {
    const active = projects.filter((p) => p.projectStatus !== "cancelled");
    if (!active.length) return 0;
    return clampPct(active.reduce((sum, p) => sum + projectProgress(tasks, milestones, p.id), 0) / active.length);
  }, [projects, tasks, milestones]);

  const companyKpis = kpis.filter((k) => !k.ownerId && !k.departmentId);
  const myKpis = profile ? kpis.filter((k) => k.ownerId === profile.id) : [];
  const companyGoals = goals.filter((g) => g.level === "company");

  if (!profile || loading) return null;

  const today = todaysTasks(tasks, profile.id);
  const overdue = overdueTasks(tasks, profile.id);
  const upcoming = upcomingDeadlines(tasks, profile.id, 14).slice(0, 6);
  const recentActivity = [...activity].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);
  const pinnedAnnouncements = [...announcements].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.createdAt - a.createdAt).slice(0, 3);

  async function toggleDone(task: Task, done: boolean) {
    await updateEntity<Task>("hqTasks", task.id, { taskStatus: done ? "completed" : "in_progress" }, profile!.id);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">{greeting()}, {profile.name.split(" ")[0]}</h1>
        <p className="mt-1 text-sm text-muted">{formatDateLong(Date.now())}</p>
      </div>

      {/* Progress rings */}
      <Card className="flex flex-wrap items-center justify-around gap-6 py-7">
        <ProgressRing pct={companyPct} color="var(--color-sage-600)" sublabel="Company Progress" size={104} />
        <ProgressRing pct={avgProjectCompletion} color="var(--color-clay-500)" sublabel="Project Completion" size={104} />
        {KPI_RING_CATEGORIES.map((c) => {
          const catKpis = companyKpis.filter((k) => k.category === c.category);
          const pct = catKpis.length ? clampPct(catKpis.reduce((s, k) => s + (k.target > 0 ? (k.current / k.target) * 100 : 0), 0) / catKpis.length) : 0;
          return <ProgressRing key={c.category} pct={pct} color={c.color} sublabel={c.label} size={104} />;
        })}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <SectionHeading title="Today" subtitle={`${today.length} task${today.length === 1 ? "" : "s"} due today`} />
            {today.length === 0 ? (
              <EmptyState icon="☀️" title="Nothing due today" hint="Enjoy the clear runway, or get ahead on something upcoming." />
            ) : (
              today.map((t) => <TaskRow key={t.id} task={t} owner={users.find((u) => u.id === t.ownerId)} onClick={() => setOpenTaskId(t.id)} onToggleDone={(d) => toggleDone(t, d)} />)
            )}
          </Card>

          {overdue.length > 0 && (
            <Card className="border-danger-400/40">
              <SectionHeading title="Overdue" subtitle={`${overdue.length} task${overdue.length === 1 ? "" : "s"} need attention`} />
              {overdue.map((t) => <TaskRow key={t.id} task={t} owner={users.find((u) => u.id === t.ownerId)} onClick={() => setOpenTaskId(t.id)} onToggleDone={(d) => toggleDone(t, d)} />)}
            </Card>
          )}

          <Card>
            <SectionHeading title="Upcoming Deadlines" subtitle="Next two weeks" />
            {upcoming.length === 0 ? (
              <EmptyState icon="📅" title="Nothing on the horizon" />
            ) : (
              upcoming.map((t) => <TaskRow key={t.id} task={t} owner={users.find((u) => u.id === t.ownerId)} onClick={() => setOpenTaskId(t.id)} onToggleDone={(d) => toggleDone(t, d)} />)
            )}
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card>
            <SectionHeading title="My KPI" />
            {myKpis.length === 0 ? (
              <EmptyState icon="🎯" title="No KPIs assigned yet" />
            ) : (
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

          <Card>
            <SectionHeading title="Company Goals" />
            <div className="flex flex-col gap-4">
              {companyGoals.slice(0, 3).map((g) => {
                const pct = goalProgress(goals, projects, milestones, tasks, g.id);
                return (
                  <div key={g.id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">{g.title}</span>
                      <span className="text-xs font-bold text-muted">{pct}%</span>
                    </div>
                    <ProgressBar pct={pct} color="var(--color-clay-500)" />
                  </div>
                );
              })}
              {companyGoals.length === 0 && <EmptyState icon="🎯" title="No company goals yet" />}
            </div>
          </Card>

          {pinnedAnnouncements.length > 0 && (
            <Card>
              <SectionHeading title="Announcements" />
              <div className="flex flex-col gap-3">
                {pinnedAnnouncements.map((a) => (
                  <div key={a.id} className="border-t border-line/70 pt-3 first:border-t-0 first:pt-0">
                    <div className="text-sm font-bold text-ink">{a.title}</div>
                    <p className="mt-0.5 text-xs text-muted">{a.body}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card>
            <SectionHeading title="Recent Activity" />
            {recentActivity.length === 0 ? (
              <EmptyState icon="🕒" title="Nothing yet" />
            ) : (
              <div className="flex flex-col gap-2.5 text-xs">
                {recentActivity.map((a) => {
                  const actor = users.find((u) => u.id === a.actorId);
                  return (
                    <div key={a.id} className="flex justify-between gap-2 text-ink-soft">
                      <span className="truncate"><b className="text-ink">{actor?.name ?? "Someone"}</b> {a.detail}</span>
                      <span className="shrink-0 text-muted">{timeAgo(a.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>

      <TaskDetailModal task={openTask} onClose={() => setOpenTaskId(null)} />
    </div>
  );
}
