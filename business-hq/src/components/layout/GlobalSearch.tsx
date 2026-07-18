import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { IconSearch } from "../common/Icons";

interface Hit {
  id: string;
  kind: "Project" | "Task" | "Goal" | "Person";
  title: string;
  meta: string;
  link: string;
}

export function GlobalSearch({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { projects, tasks, goals, users } = useData();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => { if (!open) setQ(""); }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const hits = useMemo<Hit[]>(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const out: Hit[] = [];
    for (const p of projects) {
      if (p.name.toLowerCase().includes(query)) out.push({ id: p.id, kind: "Project", title: p.name, meta: p.projectStatus, link: `/projects/${p.id}` });
    }
    for (const t of tasks) {
      if (t.title.toLowerCase().includes(query)) out.push({ id: t.id, kind: "Task", title: t.title, meta: t.taskStatus, link: `/projects/${t.projectId ?? ""}` });
    }
    for (const g of goals) {
      if (g.title.toLowerCase().includes(query)) out.push({ id: g.id, kind: "Goal", title: g.title, meta: g.level, link: "/goals" });
    }
    for (const u of users) {
      if (u.name.toLowerCase().includes(query)) out.push({ id: u.id, kind: "Person", title: u.name, meta: u.jobTitle, link: `/people/${u.id}` });
    }
    return out.slice(0, 20);
  }, [q, projects, tasks, goals, users]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/30 p-4 pt-24 backdrop-blur-[2px]" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="animate-pop-in w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-[var(--shadow-lift)]">
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <IconSearch className="text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, tasks, goals, people…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[10px] font-bold text-muted">ESC</kbd>
        </div>
        <div className="scroll-thin max-h-80 overflow-y-auto p-2">
          {q.trim() && hits.length === 0 && <div className="px-3 py-6 text-center text-sm text-muted">No matches.</div>}
          {hits.map((h) => (
            <button
              key={h.kind + h.id}
              type="button"
              onClick={() => { navigate(h.link); onClose(); }}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-surface-soft"
            >
              <span className="truncate text-sm font-semibold text-ink">{h.title}</span>
              <span className="flex shrink-0 items-center gap-2 text-[11px] text-muted">
                <span className="rounded-full bg-surface-soft px-2 py-0.5 font-bold uppercase tracking-wide">{h.kind}</span>
                {h.meta}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
