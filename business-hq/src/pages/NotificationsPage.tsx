import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card } from "../components/common/Card";
import { EmptyState } from "../components/common/EmptyState";
import { computeNotifications, type NotificationItem } from "../lib/notifications";
import { timeAgo } from "../lib/format";

const TYPE_ICON: Record<NotificationItem["type"], string> = {
  assigned: "📌",
  due_tomorrow: "⏰",
  overdue: "🔴",
  goal_achieved: "🎉",
  announcement: "📣",
};

export function NotificationsPage() {
  const { profile } = useAuth();
  const { tasks, goals, projects, milestones, announcements, loading } = useData();
  const navigate = useNavigate();

  if (!profile || loading) return null;
  const items = computeNotifications(profile.id, tasks, goals, projects, milestones, announcements);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Notifications</h1>
        <p className="mt-1 text-sm text-muted">Assignments, deadlines and wins that involve you.</p>
      </div>
      <Card>
        {items.length === 0 ? (
          <EmptyState icon="🔔" title="You're all caught up" />
        ) : (
          <div className="flex flex-col">
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => navigate(n.link)}
                className="flex items-center gap-3 border-t border-line/70 py-3 text-left first:border-t-0 hover:bg-surface-soft"
              >
                <span className="text-lg">{TYPE_ICON[n.type]}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold uppercase tracking-wide text-muted">{n.title}</div>
                  <div className="truncate text-sm font-semibold text-ink">{n.detail}</div>
                </div>
                <span className="shrink-0 text-xs text-muted">{timeAgo(n.at)}</span>
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
