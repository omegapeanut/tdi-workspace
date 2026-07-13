import { logout } from "../lib/auth";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "vvision", label: "V Vision Collaboration" },
  { id: "modula", label: "Modula Collective Roadmap" },
  { id: "team", label: "Team" },
];

export default function Layout({ active, onChange, user, children }) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark">MC</span>
          <div>
            <div className="brand-name">Modula Collective</div>
            <div className="brand-sub">Roadmap Tracker</div>
          </div>
        </div>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab ${active === t.id ? "tab-active" : ""}`}
              onClick={() => onChange(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="header-user">
          <span>{user?.email}</span>
          <button type="button" className="link-btn" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  );
}
