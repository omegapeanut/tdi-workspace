import type { ReactNode } from "react";

export function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const clickable = Boolean(onClick);
  return (
    <div
      onClick={onClick}
      className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-soft)] transition ${clickable ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = "var(--color-sage-600)",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: string;
}) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-[11px] font-bold uppercase tracking-wide text-muted">{label}</span>
      <span className="font-display text-3xl font-semibold leading-tight" style={{ color: accent }}>
        {value}
      </span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </Card>
  );
}

export function SectionHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
