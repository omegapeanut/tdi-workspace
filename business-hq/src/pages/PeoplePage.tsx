import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card } from "../components/common/Card";
import { Avatar } from "../components/common/Avatar";
import { RolePill } from "../components/common/Pills";

const AVAILABILITY_DOT: Record<string, string> = {
  available: "var(--color-sage-500)",
  busy: "var(--color-warning-500)",
  away: "var(--color-clay-500)",
  off: "var(--color-muted, #8C7F6B)",
};

export function PeoplePage() {
  const { profile } = useAuth();
  const { users, departments, tasks, loading } = useData();
  const navigate = useNavigate();

  if (!profile || loading) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">People</h1>
        <p className="mt-1 text-sm text-muted">{users.length} team member{users.length === 1 ? "" : "s"}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {users.map((u) => {
          const dept = departments.find((d) => d.id === u.departmentId);
          const manager = users.find((m) => m.id === u.managerId);
          const openTasks = tasks.filter((t) => t.ownerId === u.id && t.taskStatus !== "completed" && t.taskStatus !== "cancelled").length;

          return (
            <Card key={u.id} onClick={() => navigate(`/people/${u.id}`)} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar name={u.name} color={u.avatarColor} size="lg" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-surface" style={{ backgroundColor: AVAILABILITY_DOT[u.availability] }} />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-display text-lg font-semibold text-ink">{u.name}</div>
                  <div className="truncate text-xs text-muted">{u.jobTitle || "Team member"}</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <RolePill role={u.role} />
                {dept && <span className="rounded-full bg-surface-soft px-2.5 py-1 text-[11px] font-bold text-ink-soft">{dept.name}</span>}
              </div>
              <div className="flex items-center justify-between border-t border-line/70 pt-3 text-xs text-muted">
                <span>{manager ? `Reports to ${manager.name}` : "No manager set"}</span>
                <span className="font-bold text-ink-soft">{openTasks} open task{openTasks === 1 ? "" : "s"}</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
