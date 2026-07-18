export function EmptyState({ icon = "✓", title, hint }: { icon?: string; title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-line py-12 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="font-display text-lg text-ink-soft">{title}</p>
      {hint && <p className="max-w-xs text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <span className="rounded-full bg-surface-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-muted">Coming Soon</span>
      <h2 className="font-display text-3xl font-semibold text-ink">{title}</h2>
      <p className="max-w-md text-sm text-muted">{description}</p>
    </div>
  );
}
