export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDate(ms: number | null): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function formatDateLong(ms: number | null): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export function formatDateTime(ms: number | null): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function timeAgo(ms: number): string {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.round(s / 86400)}d ago`;
  return formatDate(ms);
}

export function daysUntil(ms: number | null): number | null {
  if (!ms) return null;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Math.round((ms - start.getTime()) / 86400000);
}

export function isSameDay(a: number, b: number): boolean {
  const da = new Date(a);
  const db_ = new Date(b);
  return da.getFullYear() === db_.getFullYear() && da.getMonth() === db_.getMonth() && da.getDate() === db_.getDate();
}

export function isThisWeek(ms: number): boolean {
  const days = daysUntil(ms);
  return days !== null && days >= 0 && days <= 7;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(n);
}

export function formatMetric(value: number, unit: string): string {
  if (unit === "$") return `$${formatNumber(value)}`;
  if (unit === "%") return `${formatNumber(value)}%`;
  return unit ? `${formatNumber(value)} ${unit}` : formatNumber(value);
}

export function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function newId(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
