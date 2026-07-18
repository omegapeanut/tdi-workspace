// Notifications are computed on the fly from live task/goal/announcement
// data rather than written to a separate collection — at this scale there's
// no missed-event risk (everything is already loaded), and it keeps the
// data model simpler until a real notification-delivery feature (push/email)
// is worth building.
import type { Announcement, Goal, Project, Task } from "../types";
import { goalProgress, isTaskOverdue } from "./rollup";
import { isSameDay } from "./format";

export interface NotificationItem {
  id: string;
  type: "assigned" | "due_tomorrow" | "overdue" | "goal_achieved" | "announcement";
  title: string;
  detail: string;
  link: string;
  at: number;
}

export function computeNotifications(
  userId: string,
  tasks: Task[],
  goals: Goal[],
  projects: Project[],
  milestones: import("../types").Milestone[],
  announcements: Announcement[],
): NotificationItem[] {
  const items: NotificationItem[] = [];
  const now = Date.now();
  const tomorrow = now + 86400000;

  const mine = tasks.filter((t) => t.ownerId === userId && t.taskStatus !== "cancelled" && t.taskStatus !== "completed");

  for (const t of mine) {
    if (t.dueDate && isSameDay(t.dueDate, tomorrow)) {
      items.push({ id: `due-${t.id}`, type: "due_tomorrow", title: "Due tomorrow", detail: t.title, link: `/projects/${t.projectId ?? ""}`, at: t.dueDate });
    }
    if (isTaskOverdue(t, now)) {
      items.push({ id: `overdue-${t.id}`, type: "overdue", title: "Overdue", detail: t.title, link: `/projects/${t.projectId ?? ""}`, at: t.dueDate ?? now });
    }
  }

  const recentlyAssigned = tasks
    .filter((t) => t.ownerId === userId && now - t.updatedAt < 86400000 * 2)
    .slice(0, 5);
  for (const t of recentlyAssigned) {
    items.push({ id: `assigned-${t.id}`, type: "assigned", title: "Assigned to you", detail: t.title, link: `/projects/${t.projectId ?? ""}`, at: t.updatedAt });
  }

  for (const g of goals) {
    const pct = goalProgress(goals, projects, milestones, tasks, g.id);
    if (pct >= 100) {
      items.push({ id: `goal-${g.id}`, type: "goal_achieved", title: "Goal achieved", detail: g.title, link: "/goals", at: g.updatedAt });
    }
  }

  for (const a of announcements.slice(0, 5)) {
    items.push({ id: `ann-${a.id}`, type: "announcement", title: "Announcement", detail: a.title, link: "/", at: a.createdAt });
  }

  return items.sort((a, b) => b.at - a.at).slice(0, 20);
}
