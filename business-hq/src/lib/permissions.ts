import type { Role, Task, User } from "../types";

// Mirrors the spec's simple permission model 1:1 — Owner sees everything,
// Admin everything except billing (there is no billing surface in v1, so in
// practice admin === owner today), Manager is scoped to their department,
// Employee is scoped to their own work. Kept as small pure functions so both
// the UI (hide/disable) and Firestore rules (deployed separately) express
// the same rules without one drifting from the other.
export function canSeeAllDepartments(role: Role): boolean {
  return role === "owner" || role === "admin";
}

export function canManageCompanyGoals(role: Role): boolean {
  return role === "owner" || role === "admin";
}

export function canManageDepartment(user: User, departmentId: string | null): boolean {
  if (user.role === "owner" || user.role === "admin") return true;
  if (user.role === "manager") return user.departmentId === departmentId;
  return false;
}

export function canManageUsers(role: Role): boolean {
  return role === "owner" || role === "admin";
}

export function canViewReports(role: Role): boolean {
  return role === "owner" || role === "admin" || role === "manager";
}

export function canEditTask(user: User, task: Task): boolean {
  if (user.role === "owner" || user.role === "admin") return true;
  if (user.role === "manager" && user.departmentId && user.departmentId === task.departmentId) return true;
  return (
    task.ownerId === user.id ||
    task.approverId === user.id ||
    task.collaboratorIds.includes(user.id) ||
    task.createdBy === user.id
  );
}

export function visibleDepartmentIds(user: User, allDepartmentIds: string[]): string[] {
  if (canSeeAllDepartments(user.role)) return allDepartmentIds;
  return user.departmentId ? [user.departmentId] : [];
}

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  employee: "Employee",
};
