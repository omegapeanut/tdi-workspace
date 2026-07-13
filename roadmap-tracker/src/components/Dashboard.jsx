import { TRACK_META } from "../lib/constants";

function allTasks(phases) {
  const out = [];
  for (const phase of phases) {
    for (const [taskId, task] of Object.entries(phase.tasks || {})) {
      out.push({ ...task, taskId, phaseId: phase.id, phaseName: phase.name, track: phase.track });
    }
  }
  return out;
}

export default function Dashboard({ phases, kpis, discussionPoints, team, onNavigate }) {
  const tasks = allTasks(phases);
  const done = tasks.filter((t) => t.status === "done").length;
  const doing = tasks.filter((t) => t.status === "doing").length;
  const todo = tasks.length - done - doing;
  const openDiscussion = discussionPoints.filter((p) => !p.resolved).length;

  return (
    <div className="dashboard">
      <div className="stat-row">
        <div className="stat-card">
          <div className="stat-value">{tasks.length ? Math.round((done / tasks.length) * 100) : 0}%</div>
          <div className="stat-label">Overall complete</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{doing}</div>
          <div className="stat-label">In progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{todo}</div>
          <div className="stat-label">Not started</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{openDiscussion}</div>
          <div className="stat-label">Open discussion points</div>
        </div>
      </div>

      <div className="track-summary-row">
        {Object.entries(TRACK_META).map(([key, meta]) => {
          const trackTasks = tasks.filter((t) => t.track === key);
          const trackDone = trackTasks.filter((t) => t.status === "done").length;
          const pct = trackTasks.length ? Math.round((trackDone / trackTasks.length) * 100) : 0;
          return (
            <button type="button" key={key} className="track-summary-card" onClick={() => onNavigate(key)}>
              <h3>{meta.label}</h3>
              <p>{meta.tagline}</p>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%` }} />
              </div>
              <span>
                {trackDone}/{trackTasks.length} tasks done
              </span>
            </button>
          );
        })}
      </div>

      <div className="workload">
        <h3>Who's on what</h3>
        <div className="workload-grid">
          {team.map((member) => {
            const mine = tasks.filter((t) => t.ownerId === member.id);
            const mineDone = mine.filter((t) => t.status === "done").length;
            const outstanding = mine.filter((t) => t.status !== "done");
            return (
              <div className="workload-card" key={member.id}>
                <div className="workload-name" style={{ borderColor: member.color }}>
                  <span className="dot" style={{ background: member.color }} />
                  {member.name}
                </div>
                <div className="workload-count">
                  {mineDone}/{mine.length} done
                </div>
                <ul>
                  {outstanding.slice(0, 5).map((t) => (
                    <li key={t.taskId}>{t.title}</li>
                  ))}
                  {outstanding.length === 0 && mine.length > 0 && <li className="all-clear">All caught up 🎉</li>}
                  {mine.length === 0 && <li className="all-clear">Nothing assigned yet</li>}
                </ul>
              </div>
            );
          })}
          {tasks.filter((t) => !t.ownerId).length > 0 && (
            <div className="workload-card unassigned">
              <div className="workload-name">Unassigned</div>
              <div className="workload-count">{tasks.filter((t) => !t.ownerId).length} tasks</div>
              <ul>
                {tasks
                  .filter((t) => !t.ownerId)
                  .slice(0, 6)
                  .map((t) => (
                    <li key={t.taskId}>{t.title}</li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {kpis.length > 0 && (
        <div className="kpi-highlight">
          <h3>12-month KPI targets</h3>
          <div className="kpi-grid">
            {kpis.map((k) => {
              const pct = k.target ? Math.min(100, Math.round(((k.current || 0) / k.target) * 100)) : 0;
              return (
                <div className="kpi-card" key={k.id}>
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-value">
                    <span>
                      {k.current || 0}
                      <small> / {k.target}{k.unit ? ` ${k.unit}` : ""}</small>
                    </span>
                  </div>
                  <div className="progress-track kpi-track">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
