import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { canViewReports } from "../../lib/permissions";
import {
  IconDashboard, IconCheck, IconFolder, IconTarget, IconBuilding, IconCalendar,
  IconUsers, IconReports, IconDocument, IconBell, IconSettings,
} from "../common/Icons";

const NAV = [
  { to: "/", label: "Dashboard", icon: IconDashboard, end: true },
  { to: "/my-tasks", label: "My Tasks", icon: IconCheck },
  { to: "/projects", label: "Projects", icon: IconFolder },
  { to: "/goals", label: "Goals", icon: IconTarget },
  { to: "/departments", label: "Departments", icon: IconBuilding },
  { to: "/calendar", label: "Calendar", icon: IconCalendar, soon: true },
  { to: "/people", label: "People", icon: IconUsers },
  { to: "/reports", label: "Reports", icon: IconReports, gate: "reports" as const },
  { to: "/documents", label: "Documents", icon: IconDocument, soon: true },
  { to: "/notifications", label: "Notifications", icon: IconBell },
  { to: "/settings", label: "Settings", icon: IconSettings },
];

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { profile } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex w-64 shrink-0 flex-col border-r border-line bg-surface transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center gap-2.5 px-5 pb-5 pt-6">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 font-display text-sm font-bold text-white">M</span>
        <div className="leading-tight">
          <div className="font-display text-base font-bold text-ink">BusinessHQ</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted">Modula</div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 scroll-thin">
        {NAV.map((item) => {
          if (item.gate === "reports" && profile && !canViewReports(profile.role)) return null;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-sage-50 text-sage-700" : "text-ink-soft hover:bg-surface-soft"
                }`
              }
            >
              <Icon className="shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.soon && <span className="rounded-full bg-surface-soft px-2 py-0.5 text-[9px] font-bold uppercase text-muted">Soon</span>}
            </NavLink>
          );
        })}
      </nav>

      {profile && (
        <div className="border-t border-line p-4">
          <div className="flex items-center gap-2.5">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {profile.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-bold text-ink">{profile.name}</div>
              <div className="truncate text-xs text-muted">{profile.jobTitle || "Team member"}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
