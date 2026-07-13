import { updateKpiCurrent } from "../lib/data";

export default function KpiGrid({ kpis }) {
  function step(kpi, delta) {
    const next = Math.max(0, (kpi.current || 0) + delta);
    updateKpiCurrent(kpi.id, next);
  }

  return (
    <div className="kpi-grid">
      {kpis.map((kpi) => {
        const pct = kpi.target ? Math.min(100, Math.round(((kpi.current || 0) / kpi.target) * 100)) : 0;
        return (
          <div className="kpi-card" key={kpi.id}>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">
              <button type="button" onClick={() => step(kpi, -1)} aria-label="Decrease">
                −
              </button>
              <span>
                {kpi.current || 0}
                <small> / {kpi.target}{kpi.unit ? ` ${kpi.unit}` : ""}</small>
              </span>
              <button type="button" onClick={() => step(kpi, 1)} aria-label="Increase">
                +
              </button>
            </div>
            <div className="progress-track kpi-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
