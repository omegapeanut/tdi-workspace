import type { Task, User } from "../../types";
import { Avatar } from "../common/Avatar";
import { StatusPill, PriorityPill } from "../common/Pills";
import { formatDate, daysUntil } from "../../lib/format";
import { isTaskOverdue } from "../../lib/rollup";

export function TaskRow({
  task,
  owner,
  onClick,
  onToggleDone,
  showProject,
  projectName,
}: {
  task: Task;
  owner?: User;
  onClick: () => void;
  onToggleDone: (done: boolean) => void;
  showProject?: boolean;
  projectName?: string;
}) {
  const overdue = isTaskOverdue(task);
  const days = daysUntil(task.dueDate);

  return (
    <div className="group flex items-center gap-3 border-t border-line/70 py-3 first:border-t-0">
      <input
        type="checkbox"
        checked={task.taskStatus === "completed"}
        onChange={(e) => onToggleDone(e.target.checked)}
        onClick={(e) => e.stopPropagation()}
        className="h-[18px] w-[18px] shrink-0 cursor-pointer accent-[var(--color-sage-600)]"
      />
      <button type="button" onClick={onClick} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <span className={`min-w-0 flex-1 truncate text-sm font-semibold ${task.taskStatus === "completed" ? "text-muted line-through" : "text-ink"}`}>
          {task.title}
        </span>
        {showProject && projectName && (
          <span className="hidden shrink-0 truncate rounded-full bg-surface-soft px-2 py-0.5 text-[11px] font-semibold text-ink-soft sm:inline-block max-w-[140px]">
            {projectName}
          </span>
        )}
      </button>
      <PriorityPill priority={task.priority} />
      <div className="hidden sm:block"><StatusPill status={task.taskStatus} /></div>
      {task.dueDate && (
        <span className={`hidden w-16 shrink-0 text-right text-xs font-semibold sm:inline ${overdue ? "text-danger-500" : "text-muted"}`}>
          {overdue ? `${Math.abs(days ?? 0)}d late` : formatDate(task.dueDate)}
        </span>
      )}
      {owner ? <Avatar name={owner.name} color={owner.avatarColor} size="xs" /> : <span className="h-6 w-6 shrink-0 rounded-full border border-dashed border-line" />}
    </div>
  );
}
