// Core domain types for BusinessHQ.
//
// Every persisted entity carries the audit/soft-delete fields the spec asks
// for (created_by/updated_by/created_at/updated_at/status) via `AuditFields`.
// Firestore doc IDs are the entity `id` and are never duplicated into other
// documents — relations are stored as ID references, so rollups/joins happen
// in `lib/rollup.ts` and `lib/select.ts`, not by denormalizing copies.

export type Role = "owner" | "admin" | "manager" | "employee";

export type EntityStatus = "active" | "archived" | "deleted";

export interface AuditFields {
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
  status: EntityStatus;
}

export interface User extends AuditFields {
  id: string;
  name: string;
  email: string;
  role: Role;
  departmentId: string | null;
  managerId: string | null;
  jobTitle: string;
  avatarColor: string;
  availability: "available" | "busy" | "away" | "off";
}

export interface Department extends AuditFields {
  id: string;
  name: string;
  leadId: string | null;
  color: string;
}

export type GoalLevel = "company" | "department";

export interface Goal extends AuditFields {
  id: string;
  level: GoalLevel;
  title: string;
  description: string;
  departmentId: string | null; // required when level === "department"
  parentGoalId: string | null; // department goal -> company goal
  ownerId: string | null;
  metricLabel: string; // e.g. "Revenue", "Leads Generated"
  target: number;
  current: number;
  unit: string; // "%", "$", "leads", ""
  dueDate: number | null;
}

export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";
export type Priority = "critical" | "high" | "medium" | "low" | "none";

export interface Risk {
  id: string;
  text: string;
  severity: "low" | "medium" | "high";
}

export interface Project extends AuditFields {
  id: string;
  name: string;
  description: string;
  goalId: string | null; // links up into the goal rollup tree
  departmentId: string | null;
  ownerId: string | null;
  memberIds: string[];
  dueDate: number | null;
  budget: number | null;
  priority: Priority;
  projectStatus: ProjectStatus;
  risks: Risk[];
}

export interface Milestone extends AuditFields {
  id: string;
  projectId: string;
  title: string;
  order: number;
  ownerId: string | null;
  dueDate: number | null;
  blocked: boolean;
  dependsOnMilestoneIds: string[];
}

export type TaskStatus =
  | "not_started"
  | "planning"
  | "in_progress"
  | "waiting"
  | "blocked"
  | "review"
  | "completed"
  | "cancelled";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Task extends AuditFields {
  id: string;
  title: string;
  description: string;
  projectId: string | null;
  milestoneId: string | null;
  parentTaskId: string | null; // subtasks reference their parent
  departmentId: string | null;
  ownerId: string | null; // exactly one owner
  approverId: string | null;
  followerIds: string[];
  collaboratorIds: string[];
  priority: Priority;
  taskStatus: TaskStatus;
  dueDate: number | null;
  estimatedHours: number | null;
  actualHours: number | null;
  tags: string[];
  checklist: ChecklistItem[];
  dependsOnTaskIds: string[];
  repeat: "none" | "daily" | "weekly" | "monthly";
  order: number;
}

export interface Comment extends AuditFields {
  id: string;
  entityType: "task" | "project";
  entityId: string;
  authorId: string;
  text: string;
}

export type ActivityAction =
  | "created"
  | "status_changed"
  | "owner_changed"
  | "commented"
  | "completed"
  | "reopened"
  | "updated";

export interface ActivityEvent extends AuditFields {
  id: string;
  entityType: "task" | "project" | "milestone" | "goal";
  entityId: string;
  actorId: string;
  action: ActivityAction;
  detail: string;
}

export type KpiCategory = "sales" | "marketing" | "development" | "operations" | "custom";

export interface Kpi extends AuditFields {
  id: string;
  label: string;
  category: KpiCategory;
  ownerId: string | null; // personal KPI when set
  departmentId: string | null; // department/company KPI when ownerId is null
  current: number;
  target: number;
  unit: string;
  period: string; // e.g. "2026-07" for monthly KPIs
  history: { period: string; value: number }[];
}

export interface Announcement extends AuditFields {
  id: string;
  title: string;
  body: string;
  authorId: string;
  pinned: boolean;
}

// ---- Derived / computed (never persisted) ----

export interface ProgressSummary {
  total: number;
  done: number;
  pct: number;
}

export interface ScorecardResult {
  userId: string;
  tasksCompleted: number;
  lateTasks: number;
  onTimePct: number;
  kpiAchievementPct: number;
  milestonesCompleted: number;
  score: number; // 0-100
  tier: "green" | "yellow" | "red";
}
