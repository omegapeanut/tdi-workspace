import type { ScorecardResult } from "../../types";

const TIER_COLOR: Record<ScorecardResult["tier"], string> = {
  green: "var(--color-sage-500)",
  yellow: "var(--color-warning-500)",
  red: "var(--color-danger-500)",
};
const TIER_LABEL: Record<ScorecardResult["tier"], string> = { green: "On Track", yellow: "Needs Attention", red: "At Risk" };

export function Scorecard({ result }: { result: ScorecardResult }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <span className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-white" style={{ backgroundColor: TIER_COLOR[result.tier] }}>
          {result.score}
        </span>
        <div>
          <div className="text-sm font-bold" style={{ color: TIER_COLOR[result.tier] }}>{TIER_LABEL[result.tier]}</div>
          <div className="text-xs text-muted">Weekly score</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Stat label="Tasks Completed" value={result.tasksCompleted} />
        <Stat label="Late Tasks" value={result.lateTasks} warn={result.lateTasks > 0} />
        <Stat label="On-time %" value={`${result.onTimePct}%`} />
        <Stat label="KPI Achievement" value={`${result.kpiAchievementPct}%`} />
        <Stat label="Milestones Done" value={result.milestonesCompleted} />
      </div>
    </div>
  );
}

function Stat({ label, value, warn }: { label: string; value: number | string; warn?: boolean }) {
  return (
    <div className="rounded-xl bg-surface-soft px-3 py-2.5">
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted">{label}</div>
      <div className={`font-display text-xl font-semibold ${warn ? "text-danger-500" : "text-ink"}`}>{value}</div>
    </div>
  );
}
