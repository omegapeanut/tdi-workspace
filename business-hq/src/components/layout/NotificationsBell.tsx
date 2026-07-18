import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { computeNotifications } from "../../lib/notifications";
import { timeAgo } from "../../lib/format";
import { IconBell } from "../common/Icons";

export function NotificationsBell() {
  const { profile } = useAuth();
  const { tasks, goals, projects, milestones, announcements } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (!profile) return null;
  const items = computeNotifications(profile.id, tasks, goals, projects, milestones, announcements);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative grid h-9 w-9 place-items-center rounded-full text-ink-soft transition hover:bg-surface-soft"
        aria-label="Notifications"
      >
        <IconBell />
        {items.length > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-clay-500" />
        )}
      </button>
      {open && (
        <div className="animate-pop-in absolute right-0 z-40 mt-2 w-80 rounded-2xl border border-line bg-surface p-2 shadow-[var(--shadow-lift)]">
          <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-muted">Notifications</div>
          <div className="scroll-thin max-h-80 overflow-y-auto">
            {items.length === 0 && <div className="px-2 py-6 text-center text-sm text-muted">You're all caught up.</div>}
            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => { setOpen(false); navigate(n.link); }}
                className="flex w-full flex-col items-start gap-0.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-surface-soft"
              >
                <span className="text-xs font-bold text-ink-soft">{n.title}</span>
                <span className="truncate text-sm text-ink">{n.detail}</span>
                <span className="text-[11px] text-muted">{timeAgo(n.at)}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
