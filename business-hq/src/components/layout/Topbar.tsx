import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { NotificationsBell } from "./NotificationsBell";
import { GlobalSearch } from "./GlobalSearch";
import { QuickCreateModal } from "./QuickCreateModal";
import { IconSearch, IconPlus } from "../common/Icons";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-surface/85 px-4 py-3 backdrop-blur-md lg:px-8">
      <button type="button" onClick={onMenuClick} className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-soft lg:hidden" aria-label="Menu">
        ☰
      </button>

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex flex-1 max-w-sm items-center gap-2 rounded-full border border-line bg-bg px-3.5 py-2 text-sm text-muted transition hover:border-sage-300"
      >
        <IconSearch className="h-4 w-4" />
        <span className="flex-1 text-left">Search everything…</span>
        <kbd className="hidden rounded-md border border-line bg-surface px-1.5 py-0.5 text-[10px] font-bold sm:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-1.5 rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-sage-700"
        >
          <IconPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Create</span>
        </button>
        <NotificationsBell />
        <button type="button" onClick={() => signOut()} className="hidden rounded-full px-3 py-2 text-sm font-semibold text-muted transition hover:bg-surface-soft hover:text-ink sm:inline-block">
          Sign out
        </button>
      </div>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <QuickCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </header>
  );
}
