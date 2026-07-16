import type { Priority, ProjectStatus, Role, TaskStatus } from "../../types";
import { ROLE_LABEL } from "../../lib/permissions";

const TASK_STATUS_STYLE: Record<TaskStatus, { label: string; bg: string; fg: string }> = {
  not_started: { label: "Not Started", bg: "var(--color-surface-soft)", fg: "var(--color-ink-soft)" },
  planning: { label: "Planning", bg: "var(--color-info-50)", fg: "var(--color-info-500)" },
  in_progress: { label: "In Progress", bg: "var(--color-sage-50)", fg: "var(--color-sage-600)" },
  waiting: { label: "Waiting", bg: "var(--color-warning-50)", fg: "var(--color-warning-500)" },
  blocked: { label: "Blocked", bg: "var(--color-danger-50)", fg: "var(--color-danger-500)" },
  review: { label: "Review", bg: "var(--color-violet-50)", fg: "var(--color-violet-500)" },
  completed: { label: "Completed", bg: "var(--color-sage-100)", fg: "var(--color-sage-700)" },
  cancelled: { label: "Cancelled", bg: "var(--color-surface-soft)", fg: "var(--color-muted)" },
};

const PROJECT_STATUS_STYLE: Record<ProjectStatus, { label: string; bg: string; fg: string }> = {
  planning: { label: "Planning", bg: "var(--color-info-50)", fg: "var(--color-info-500)" },
  active: { label: "Active", bg: "var(--color-sage-50)", fg: "var(--color-sage-600)" },
  on_hold: { label: "On Hold", bg: "var(--color-warning-50)", fg: "var(--color-warning-500)" },
  completed: { label: "Completed", bg: "var(--color-sage-100)", fg: "var(--color-sage-700)" },
  cancelled: { label: "Cancelled", bg: "var(--color-surface-soft)", fg: "var(--color-muted)" },
};

const PRIORITY_STYLE: Record<Priority, { label: string; fg: string }> = {
  critical: { label: "Critical", fg: "var(--color-danger-500)" },
  high: { label: "High", fg: "var(--color-clay-500)" },
  medium: { label: "Medium", fg: "var(--color-warning-500)" },
  low: { label: "Low", fg: "var(--color-sage-600)" },
  none: { label: "No Priority", fg: "var(--color-muted)" },
};

function Pill({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
      style={{ backgroundColor: bg, color: fg }}
    >
      {label}
    </span>
  );
}

export function StatusPill({ status }: { status: TaskStatus }) {
  const s = TASK_STATUS_STYLE[status];
  return <Pill label={s.label} bg={s.bg} fg={s.fg} />;
}

export function ProjectStatusPill({ status }: { status: ProjectStatus }) {
  const s = PROJECT_STATUS_STYLE[status];
  return <Pill label={s.label} bg={s.bg} fg={s.fg} />;
}

export function PriorityPill({ priority }: { priority: Priority }) {
  const s = PRIORITY_STYLE[priority];
  if (priority === "none") return <span className="text-[11px] font-semibold text-muted">No Priority</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold" style={{ color: s.fg }}>
      <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="4" /></svg>
      {s.label}
    </span>
  );
}

export function RolePill({ role }: { role: Role }) {
  return <Pill label={ROLE_LABEL[role]} bg="var(--color-surface-soft)" fg="var(--color-ink-soft)" />;
}

export { TASK_STATUS_STYLE, PROJECT_STATUS_STYLE, PRIORITY_STYLE };
