import type { Task } from "../types";
import { isSameDay, isThisWeek } from "./format";
import { isTaskOverdue } from "./rollup";

const liveTasks = (tasks: Task[]) => tasks.filter((t) => t.taskStatus !== "cancelled");

export function todaysTasks(tasks: Task[], userId: string): Task[] {
  const now = Date.now();
  return liveTasks(tasks).filter(
    (t) => t.ownerId === userId && t.taskStatus !== "completed" && t.dueDate && isSameDay(t.dueDate, now),
  );
}

export function overdueTasks(tasks: Task[], userId?: string): Task[] {
  return liveTasks(tasks).filter((t) => (userId ? t.ownerId === userId : true) && isTaskOverdue(t));
}

export function upcomingDeadlines(tasks: Task[], userId?: string, days = 14): Task[] {
  const now = Date.now();
  const horizon = now + days * 86400000;
  return liveTasks(tasks)
    .filter((t) => (userId ? t.ownerId === userId : true) && t.taskStatus !== "completed" && t.dueDate && t.dueDate >= now && t.dueDate <= horizon)
    .sort((a, b) => (a.dueDate ?? 0) - (b.dueDate ?? 0));
}

export function thisWeekTasks(tasks: Task[], userId: string): Task[] {
  return liveTasks(tasks).filter((t) => t.ownerId === userId && t.taskStatus !== "completed" && t.dueDate && isThisWeek(t.dueDate));
}

export function waitingTasks(tasks: Task[], userId: string): Task[] {
  return liveTasks(tasks).filter((t) => t.ownerId === userId && (t.taskStatus === "waiting" || t.taskStatus === "blocked"));
}

export function completedTasks(tasks: Task[], userId: string): Task[] {
  return tasks.filter((t) => t.ownerId === userId && t.taskStatus === "completed").sort((a, b) => b.updatedAt - a.updatedAt);
}

export function blockedTasks(tasks: Task[]): Task[] {
  return liveTasks(tasks).filter((t) => t.taskStatus === "blocked");
}
