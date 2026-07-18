import { useState } from "react";
import { Modal } from "../common/Modal";
import { Avatar } from "../common/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { updateEntity, logActivity, createEntity, softDeleteEntity } from "../../lib/mutations";
import { formatDateTime, newId, timeAgo } from "../../lib/format";
import type { ChecklistItem, Priority, Task, TaskStatus } from "../../types";

const STATUSES: TaskStatus[] = ["not_started", "planning", "in_progress", "waiting", "blocked", "review", "completed", "cancelled"];
const PRIORITIES: Priority[] = ["critical", "high", "medium", "low", "none"];
const STATUS_LABEL: Record<TaskStatus, string> = {
  not_started: "Not Started", planning: "Planning", in_progress: "In Progress", waiting: "Waiting",
  blocked: "Blocked", review: "Review", completed: "Completed", cancelled: "Cancelled",
};
const PRIORITY_LABEL: Record<Priority, string> = { critical: "Critical", high: "High", medium: "Medium", low: "Low", none: "No Priority" };

function fieldLabel(text: string) {
  return <div className="mb-1 text-[11px] font-bold uppercase tracking-wide text-muted">{text}</div>;
}

export function TaskDetailModal({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const { profile } = useAuth();
  const { users, comments, activity, tasks } = useData();
  const [newChecklistText, setNewChecklistText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [commentText, setCommentText] = useState("");
  const [newSubtask, setNewSubtask] = useState("");

  if (!task || !profile) return null;

  async function patch(fields: Partial<Task>) {
    await updateEntity<Task>("hqTasks", task!.id, fields, profile!.id);
  }

  async function setStatus(taskStatus: TaskStatus) {
    await patch({ taskStatus });
    await logActivity("task", task!.id, profile!.id, taskStatus === "completed" ? "completed" : "status_changed", `moved to ${STATUS_LABEL[taskStatus]}`);
  }

  async function toggleChecklistItem(item: ChecklistItem) {
    const checklist = task!.checklist.map((c) => (c.id === item.id ? { ...c, done: !c.done } : c));
    await patch({ checklist });
  }

  async function addChecklistItem() {
    if (!newChecklistText.trim()) return;
    const checklist: ChecklistItem[] = [...task!.checklist, { id: newId("chk"), text: newChecklistText.trim(), done: false }];
    await patch({ checklist });
    setNewChecklistText("");
  }

  async function removeChecklistItem(id: string) {
    await patch({ checklist: task!.checklist.filter((c) => c.id !== id) });
  }

  async function addTag() {
    if (!newTag.trim() || task!.tags.includes(newTag.trim())) return setNewTag("");
    await patch({ tags: [...task!.tags, newTag.trim()] });
    setNewTag("");
  }

  async function removeTag(tag: string) {
    await patch({ tags: task!.tags.filter((t) => t !== tag) });
  }

  async function postComment() {
    if (!commentText.trim()) return;
    await createEntity("hqComments", { entityType: "task", entityId: task!.id, authorId: profile!.id, text: commentText.trim() }, profile!.id);
    await logActivity("task", task!.id, profile!.id, "commented", "left a comment");
    setCommentText("");
  }

  async function addSubtask() {
    if (!newSubtask.trim()) return;
    await createEntity<Task>(
      "hqTasks",
      {
        title: newSubtask.trim(), description: "", projectId: task!.projectId, milestoneId: task!.milestoneId,
        parentTaskId: task!.id, departmentId: task!.departmentId, ownerId: profile!.id, approverId: null,
        followerIds: [], collaboratorIds: [], priority: "none", taskStatus: "not_started", dueDate: null,
        estimatedHours: null, actualHours: null, tags: [], checklist: [], dependsOnTaskIds: [], repeat: "none",
        order: Date.now(),
      },
      profile!.id,
    );
    setNewSubtask("");
  }

  const owner = users.find((u) => u.id === task.ownerId);
  const taskComments = comments.filter((c) => c.entityType === "task" && c.entityId === task.id).sort((a, b) => a.createdAt - b.createdAt);
  const taskActivity = activity.filter((a) => a.entityType === "task" && a.entityId === task.id).sort((a, b) => b.createdAt - a.createdAt);
  const subtasks = tasks.filter((t) => t.parentTaskId === task.id);
  const doneChecklist = task.checklist.filter((c) => c.done).length;

  return (
    <Modal open onClose={onClose} title="" wide>
      <input
        defaultValue={task.title}
        onBlur={(e) => e.target.value.trim() && e.target.value !== task.title && patch({ title: e.target.value.trim() })}
        className="mb-1 w-full border-none bg-transparent font-display text-2xl font-semibold text-ink outline-none"
      />
      <textarea
        defaultValue={task.description}
        placeholder="Add a description…"
        onBlur={(e) => e.target.value !== task.description && patch({ description: e.target.value })}
        rows={2}
        className="mb-5 w-full resize-none rounded-xl border border-transparent bg-transparent px-0 text-sm text-ink-soft outline-none transition hover:border-line focus:border-line focus:bg-bg focus:px-3 focus:py-2"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div>
          {fieldLabel("Status")}
          <select value={task.taskStatus} onChange={(e) => setStatus(e.target.value as TaskStatus)} className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm">
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div>
          {fieldLabel("Priority")}
          <select value={task.priority} onChange={(e) => patch({ priority: e.target.value as Priority })} className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm">
            {PRIORITIES.map((p) => <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>)}
          </select>
        </div>
        <div>
          {fieldLabel("Owner")}
          <select value={task.ownerId ?? ""} onChange={(e) => patch({ ownerId: e.target.value || null })} className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm">
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          {fieldLabel("Approver")}
          <select value={task.approverId ?? ""} onChange={(e) => patch({ approverId: e.target.value || null })} className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm">
            <option value="">None</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          {fieldLabel("Due Date")}
          <input
            type="date"
            defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ""}
            onChange={(e) => patch({ dueDate: e.target.value ? new Date(e.target.value).getTime() : null })}
            className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm text-ink-soft"
          />
        </div>
        <div>
          {fieldLabel("Repeat")}
          <select value={task.repeat} onChange={(e) => patch({ repeat: e.target.value as Task["repeat"] })} className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm">
            <option value="none">Doesn't repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          {fieldLabel("Estimated Hours")}
          <input type="number" min={0} defaultValue={task.estimatedHours ?? ""} onBlur={(e) => patch({ estimatedHours: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm" />
        </div>
        <div>
          {fieldLabel("Actual Hours")}
          <input type="number" min={0} defaultValue={task.actualHours ?? ""} onBlur={(e) => patch({ actualHours: e.target.value ? Number(e.target.value) : null })} className="w-full rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm" />
        </div>
        <div>
          {fieldLabel("Followers")}
          <div className="flex flex-wrap gap-1 pt-1">
            {users.filter((u) => task.followerIds.includes(u.id)).map((u) => <Avatar key={u.id} name={u.name} color={u.avatarColor} size="xs" />)}
            <select
              value=""
              onChange={(e) => e.target.value && patch({ followerIds: [...task.followerIds, e.target.value] })}
              className="rounded-lg border border-dashed border-line bg-surface px-2 py-1 text-xs text-muted"
            >
              <option value="">+ Add</option>
              {users.filter((u) => !task.followerIds.includes(u.id)).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-5">
        {fieldLabel("Tags")}
        <div className="flex flex-wrap items-center gap-1.5">
          {task.tags.map((tag) => (
            <button key={tag} type="button" onClick={() => removeTag(tag)} className="rounded-full bg-surface-soft px-2.5 py-1 text-xs font-semibold text-ink-soft hover:bg-danger-50 hover:text-danger-500">
              {tag} ×
            </button>
          ))}
          <input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTag()}
            placeholder="+ tag"
            className="w-20 rounded-full border border-dashed border-line bg-transparent px-2.5 py-1 text-xs outline-none"
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="mt-5">
        {fieldLabel(`Checklist ${task.checklist.length ? `(${doneChecklist}/${task.checklist.length})` : ""}`)}
        <div className="flex flex-col gap-1.5">
          {task.checklist.map((c) => (
            <div key={c.id} className="group flex items-center gap-2">
              <input type="checkbox" checked={c.done} onChange={() => toggleChecklistItem(c)} className="h-4 w-4 accent-[var(--color-sage-600)]" />
              <span className={`flex-1 text-sm ${c.done ? "text-muted line-through" : "text-ink"}`}>{c.text}</span>
              <button type="button" onClick={() => removeChecklistItem(c.id)} className="text-xs text-muted opacity-0 hover:text-danger-500 group-hover:opacity-100">Remove</button>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addChecklistItem()}
              placeholder="Add a checklist item…"
              className="flex-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-sage-400"
            />
            <button type="button" onClick={addChecklistItem} className="rounded-lg border border-line px-3 text-sm font-semibold text-ink-soft hover:bg-surface-soft">Add</button>
          </div>
        </div>
      </div>

      {/* Subtasks */}
      <div className="mt-5">
        {fieldLabel(`Subtasks ${subtasks.length ? `(${subtasks.filter((s) => s.taskStatus === "completed").length}/${subtasks.length})` : ""}`)}
        <div className="flex flex-col gap-1.5">
          {subtasks.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.taskStatus === "completed"}
                onChange={(e) => updateEntity<Task>("hqTasks", s.id, { taskStatus: e.target.checked ? "completed" : "not_started" }, profile.id)}
                className="h-4 w-4 accent-[var(--color-sage-600)]"
              />
              <span className={`flex-1 text-sm ${s.taskStatus === "completed" ? "text-muted line-through" : "text-ink"}`}>{s.title}</span>
            </div>
          ))}
          <div className="flex gap-2">
            <input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSubtask()}
              placeholder="Add a subtask…"
              className="flex-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-sage-400"
            />
            <button type="button" onClick={addSubtask} className="rounded-lg border border-line px-3 text-sm font-semibold text-ink-soft hover:bg-surface-soft">Add</button>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-5">
        {fieldLabel("Comments")}
        <div className="flex flex-col gap-3">
          {taskComments.map((c) => {
            const author = users.find((u) => u.id === c.authorId);
            return (
              <div key={c.id} className="flex gap-2.5">
                <Avatar name={author?.name ?? "?"} color={author?.avatarColor} size="xs" />
                <div className="flex-1 rounded-xl bg-surface-soft px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink-soft">{author?.name ?? "Someone"}</span>
                    <span className="text-[11px] text-muted">{timeAgo(c.createdAt)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink">{c.text}</p>
                </div>
              </div>
            );
          })}
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && postComment()}
              placeholder="Write a comment…"
              className="flex-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-sm outline-none focus:border-sage-400"
            />
            <button type="button" onClick={postComment} className="rounded-lg bg-sage-600 px-3 text-sm font-bold text-white hover:bg-sage-700">Post</button>
          </div>
        </div>
      </div>

      {/* Activity */}
      {taskActivity.length > 0 && (
        <div className="mt-5">
          {fieldLabel("Activity")}
          <div className="flex flex-col gap-1.5 text-xs text-muted">
            {taskActivity.slice(0, 8).map((a) => {
              const actor = users.find((u) => u.id === a.actorId);
              return <div key={a.id}>{actor?.name ?? "Someone"} {a.detail} · {formatDateTime(a.createdAt)}</div>;
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between border-t border-line pt-4">
        <button
          type="button"
          onClick={() => { softDeleteEntity("hqTasks", task.id, profile.id); onClose(); }}
          className="text-xs font-semibold text-danger-500 hover:underline"
        >
          Delete task
        </button>
        <span className="text-xs text-muted">Owner: {owner?.name ?? "Unassigned"}</span>
      </div>
    </Modal>
  );
}
