import TaskRow from "./TaskRow";

export default function PhaseCard({ phase, team }) {
  const tasks = Object.entries(phase.tasks || {}).sort((a, b) => (a[1].order || 0) - (b[1].order || 0));
  const total = tasks.length;
  const done = tasks.filter(([, t]) => t.status === "done").length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="phase-card">
      <div className="phase-header">
        <div>
          <span className="phase-timeframe">{phase.timeframe}</span>
          <h3>{phase.name}</h3>
          {phase.summary && <p className="phase-summary">{phase.summary}</p>}
        </div>
        <div className="phase-progress">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span>
            {done}/{total} done
          </span>
        </div>
      </div>
      {phase.kpis?.length > 0 && (
        <div className="phase-kpis">
          {phase.kpis.map((k, i) => (
            <span key={i} className="phase-kpi-chip">
              {k}
            </span>
          ))}
        </div>
      )}
      <div className="task-list">
        {tasks.map(([taskId, task]) => (
          <TaskRow key={taskId} phaseId={phase.id} taskId={taskId} task={task} team={team} />
        ))}
      </div>
    </div>
  );
}
