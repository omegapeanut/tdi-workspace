// Progress "automation" engine.
//
// The spec describes a write-cascade: task complete -> milestone updates ->
// project updates -> department goal updates -> company goal updates. At
// this product's scale (2-30 people, the whole workspace already lives in
// memory via DataContext) that cascade is implemented as pure, on-read
// computation instead of a chain of Firestore writes/Cloud Functions —
// progress is *always* correct because it's derived, never stale because
// there's nothing cached to go stale, and there's no server-side automation
// pipeline to build/maintain for what is fundamentally a read-time rollup.
import type { Goal, Kpi, Milestone, Project, ScorecardResult, Task, TaskStatus } from "../types";
import { clampPct } from "./format";

const STATUS_PARTIAL_PROGRESS: Record<TaskStatus, number> = {
  not_started: 0,
  planning: 10,
  in_progress: 50,
  waiting: 40,
  blocked: 40,
  review: 80,
  completed: 100,
  cancelled: 0,
};

/** A single task's progress, 0-100. Cancelled tasks are excluded from rollups by callers. */
export function taskProgress(task: Task): number {
  if (task.taskStatus === "completed") return 100;
  if (task.checklist.length > 0) {
    const done = task.checklist.filter((c) => c.done).length;
    return clampPct((done / task.checklist.length) * 100);
  }
  return STATUS_PARTIAL_PROGRESS[task.taskStatus];
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return clampPct(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function liveTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.taskStatus !== "cancelled");
}

export function tasksForMilestone(tasks: Task[], milestoneId: string): Task[] {
  return liveTasks(tasks).filter((t) => t.milestoneId === milestoneId);
}

export function milestoneProgress(tasks: Task[], milestoneId: string): number {
  return avg(tasksForMilestone(tasks, milestoneId).map(taskProgress));
}

export function tasksForProject(tasks: Task[], projectId: string): Task[] {
  return liveTasks(tasks).filter((t) => t.projectId === projectId);
}

function tasksDirectlyOnProject(tasks: Task[], projectId: string): Task[] {
  return liveTasks(tasks).filter((t) => t.projectId === projectId && !t.milestoneId);
}

export function projectProgress(tasks: Task[], milestones: Milestone[], projectId: string): number {
  const ms = milestones.filter((m) => m.projectId === projectId);
  const units = [
    ...ms.map((m) => milestoneProgress(tasks, m.id)),
    ...tasksDirectlyOnProject(tasks, projectId).map(taskProgress),
  ];
  return avg(units);
}

export function childGoals(goals: Goal[], goalId: string): Goal[] {
  return goals.filter((g) => g.parentGoalId === goalId);
}

export function projectsForGoal(projects: Project[], goalId: string): Project[] {
  return projects.filter((p) => p.goalId === goalId && p.projectStatus !== "cancelled");
}

export function goalProgress(
  goals: Goal[],
  projects: Project[],
  milestones: Milestone[],
  tasks: Task[],
  goalId: string,
): number {
  const goal = goals.find((g) => g.id === goalId);
  if (!goal) return 0;

  const kids = childGoals(goals, goalId);
  if (kids.length) {
    return avg(kids.map((k) => goalProgress(goals, projects, milestones, tasks, k.id)));
  }

  const linkedProjects = projectsForGoal(projects, goalId);
  if (linkedProjects.length) {
    return avg(linkedProjects.map((p) => projectProgress(tasks, milestones, p.id)));
  }

  // Leaf goal with no linked structure yet — fall back to its own numeric metric.
  return goal.target > 0 ? clampPct((goal.current / goal.target) * 100) : 0;
}

export function overallTaskProgress(tasks: Task[]): number {
  return avg(liveTasks(tasks).map(taskProgress));
}

export function isTaskOverdue(task: Task, now = Date.now()): boolean {
  return Boolean(task.dueDate) && task.dueDate! < now && task.taskStatus !== "completed" && task.taskStatus !== "cancelled";
}

export function isTaskLate(task: Task): boolean {
  return Boolean(task.dueDate) && task.taskStatus === "completed" && task.updatedAt > task.dueDate!;
}

/** Per-employee scorecard per the spec: completion rate, on-time %, KPI achievement, traffic-light tier. */
export function computeScorecard(
  userId: string,
  tasks: Task[],
  milestones: Milestone[],
  kpis: Kpi[],
): ScorecardResult {
  const mine = liveTasks(tasks).filter((t) => t.ownerId === userId);
  const completed = mine.filter((t) => t.taskStatus === "completed");
  const late = completed.filter(isTaskLate);
  const onTimePct = completed.length ? clampPct(((completed.length - late.length) / completed.length) * 100) : 100;

  const myKpis = kpis.filter((k) => k.ownerId === userId);
  const kpiAchievementPct = myKpis.length
    ? avg(myKpis.map((k) => (k.target > 0 ? clampPct((k.current / k.target) * 100) : 0)))
    : 100;

  const milestonesCompleted = milestones.filter(
    (m) => m.ownerId === userId && tasksForMilestone(tasks, m.id).length > 0 && milestoneProgress(tasks, m.id) >= 100,
  ).length;

  const volumeScore = Math.min(100, completed.length * 10);
  const score = clampPct(onTimePct * 0.4 + kpiAchievementPct * 0.4 + volumeScore * 0.2);
  const tier: ScorecardResult["tier"] = score >= 75 ? "green" : score >= 50 ? "yellow" : "red";

  return {
    userId,
    tasksCompleted: completed.length,
    lateTasks: late.length,
    onTimePct,
    kpiAchievementPct,
    milestonesCompleted,
    score,
    tier,
  };
}
