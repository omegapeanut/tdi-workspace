import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card, SectionHeading } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { ProgressRing } from "../components/common/ProgressRing";
import { ProjectStatusPill } from "../components/common/Pills";
import { Avatar } from "../components/common/Avatar";
import { MilestonesTab } from "../components/projects/MilestonesTab";
import { TasksTab } from "../components/projects/TasksTab";
import { updateEntity, createEntity, softDeleteEntity } from "../lib/mutations";
import { projectProgress } from "../lib/rollup";
import { formatDate, newId, timeAgo } from "../lib/format";
import type { Priority, Project, ProjectStatus, Risk } from "../types";

const TABS = ["Overview", "Milestones", "Tasks", "Discussion", "Risks", "Activity"] as const;
type Tab = (typeof TABS)[number];

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { projects, tasks, milestones, users, departments, comments, activity, loading } = useData();
  const [tab, setTab] = useState<Tab>("Overview");
  const [riskText, setRiskText] = useState("");
  const [commentText, setCommentText] = useState("");

  const project = projects.find((p) => p.id === projectId);

  if (!profile || loading) return null;
  if (!project) return <EmptyState icon="🔍" title="Project not found" hint="It may have been removed." />;

  const pct = projectProgress(tasks, milestones, project.id);
  const dept = departments.find((d) => d.id === project.departmentId);
  const members = users.filter((u) => project.memberIds.includes(u.id));
  const projectComments = comments.filter((c) => c.entityType === "project" && c.entityId === project.id).sort((a, b) => a.createdAt - b.createdAt);
  const projectActivity = activity.filter((a) => a.entityType === "project" && a.entityId === project.id).sort((a, b) => b.createdAt - a.createdAt);

  async function patch(fields: Partial<Project>) {
    await updateEntity<Project>("hqProjects", project!.id, fields, profile!.id);
  }

  async function addRisk() {
    if (!riskText.trim()) return;
    const risks: Risk[] = [...(project!.risks ?? []), { id: newId("risk"), text: riskText.trim(), severity: "medium" }];
    await patch({ risks });
    setRiskText("");
  }

  async function postComment() {
    if (!commentText.trim()) return;
    await createEntity("hqComments", { entityType: "project", entityId: project!.id, authorId: profile!.id, text: commentText.trim() }, profile!.id);
    setCommentText("");
  }

  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={() => navigate("/projects")} className="w-fit text-sm font-semibold text-muted hover:text-ink">← All projects</button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <input
              defaultValue={project.name}
              onBlur={(e) => e.target.value.trim() && e.target.value !== project.name && patch({ name: e.target.value.trim() })}
              className="border-none bg-transparent font-display text-3xl font-semibold text-ink outline-none"
            />
            <ProjectStatusPill status={project.projectStatus} />
          </div>
          {dept && <p className="mt-1 text-sm text-muted">{dept.name}</p>}
        </div>
        <ProgressRing pct={pct} size={72} stroke={7} />
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-semibold transition ${tab === t ? "border-sage-600 text-sage-700" : "border-transparent text-muted hover:text-ink"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Card>
              <SectionHeading title="Description" />
              <textarea
                defaultValue={project.description}
                onBlur={(e) => e.target.value !== project.description && patch({ description: e.target.value })}
                rows={4}
                placeholder="What's this project about?"
                className="w-full resize-none rounded-xl border border-line bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-sage-400"
              />
            </Card>
            <Card>
              <SectionHeading title="Files" />
              <EmptyState icon="📎" title="File attachments coming soon" hint="For now, share files via your usual channel and link them in Discussion." />
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card className="flex flex-col gap-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted">Owner</span>
                <select value={project.ownerId ?? ""} onChange={(e) => patch({ ownerId: e.target.value || null })} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs">
                  <option value="">Unassigned</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between"><span className="text-muted">Status</span>
                <select value={project.projectStatus} onChange={(e) => patch({ projectStatus: e.target.value as ProjectStatus })} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs">
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex items-center justify-between"><span className="text-muted">Priority</span>
                <select value={project.priority} onChange={(e) => patch({ priority: e.target.value as Priority })} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="none">No Priority</option>
                </select>
              </div>
              <div className="flex items-center justify-between"><span className="text-muted">Due Date</span>
                <input type="date" defaultValue={project.dueDate ? new Date(project.dueDate).toISOString().slice(0, 10) : ""} onChange={(e) => patch({ dueDate: e.target.value ? new Date(e.target.value).getTime() : null })} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs" />
              </div>
              <div className="flex items-center justify-between"><span className="text-muted">Budget</span>
                <input type="number" defaultValue={project.budget ?? ""} onBlur={(e) => patch({ budget: e.target.value ? Number(e.target.value) : null })} placeholder="—" className="w-24 rounded-lg border border-line bg-surface px-2 py-1 text-right text-xs" />
              </div>
            </Card>
            <Card>
              <SectionHeading title="Members" />
              <div className="flex flex-wrap gap-2">
                {members.map((m) => <Avatar key={m.id} name={m.name} color={m.avatarColor} size="sm" />)}
                <select
                  value=""
                  onChange={(e) => e.target.value && patch({ memberIds: [...project.memberIds, e.target.value] })}
                  className="rounded-full border border-dashed border-line bg-surface px-2 py-1 text-xs text-muted"
                >
                  <option value="">+ Add member</option>
                  {users.filter((u) => !project.memberIds.includes(u.id)).map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </Card>
            <button type="button" onClick={() => { softDeleteEntity("hqProjects", project.id, profile.id); navigate("/projects"); }} className="text-xs font-semibold text-danger-500 hover:underline">
              Delete project
            </button>
          </div>
        </div>
      )}

      {tab === "Milestones" && <MilestonesTab projectId={project.id} />}
      {tab === "Tasks" && <TasksTab projectId={project.id} />}

      {tab === "Discussion" && (
        <Card>
          <div className="flex flex-col gap-3">
            {projectComments.length === 0 && <EmptyState icon="💬" title="No discussion yet" />}
            {projectComments.map((c) => {
              const author = users.find((u) => u.id === c.authorId);
              return (
                <div key={c.id} className="flex gap-2.5">
                  <Avatar name={author?.name ?? "?"} color={author?.avatarColor} size="xs" />
                  <div className="flex-1 rounded-xl bg-surface-soft px-3 py-2">
                    <div className="flex items-center justify-between"><span className="text-xs font-bold text-ink-soft">{author?.name}</span><span className="text-[11px] text-muted">{timeAgo(c.createdAt)}</span></div>
                    <p className="mt-0.5 text-sm text-ink">{c.text}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-2">
              <input value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && postComment()} placeholder="Write a comment…" className="flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-sage-400" />
              <button type="button" onClick={postComment} className="rounded-lg bg-sage-600 px-4 text-sm font-bold text-white hover:bg-sage-700">Post</button>
            </div>
          </div>
        </Card>
      )}

      {tab === "Risks" && (
        <Card>
          <div className="flex flex-col gap-3">
            {(!project.risks || project.risks.length === 0) && <EmptyState icon="⚠️" title="No known risks" />}
            {project.risks?.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 border-t border-line/70 py-2 first:border-t-0">
                <span className="text-sm text-ink">{r.text}</span>
                <button type="button" onClick={() => patch({ risks: project.risks.filter((x) => x.id !== r.id) })} className="text-xs font-semibold text-danger-500 hover:underline">Resolve</button>
              </div>
            ))}
            <div className="flex gap-2">
              <input value={riskText} onChange={(e) => setRiskText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addRisk()} placeholder="Flag a risk or blocker…" className="flex-1 rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-sage-400" />
              <button type="button" onClick={addRisk} className="rounded-lg border border-line px-4 text-sm font-semibold text-ink-soft hover:bg-surface-soft">Add</button>
            </div>
          </div>
        </Card>
      )}

      {tab === "Activity" && (
        <Card>
          {projectActivity.length === 0 ? <EmptyState icon="🕒" title="No activity yet" /> : (
            <div className="flex flex-col gap-2.5 text-sm">
              {projectActivity.map((a) => {
                const actor = users.find((u) => u.id === a.actorId);
                return <div key={a.id} className="flex justify-between border-t border-line/70 py-2 first:border-t-0"><span><b>{actor?.name}</b> {a.detail}</span><span className="text-xs text-muted">{formatDate(a.createdAt)}</span></div>;
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
