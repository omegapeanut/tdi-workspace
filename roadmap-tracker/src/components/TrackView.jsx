import { TRACK_META } from "../lib/constants";
import PhaseCard from "./PhaseCard";
import KpiGrid from "./KpiGrid";
import DiscussionPoints from "./DiscussionPoints";

export default function TrackView({ track, phases, kpis, discussionPoints, team }) {
  const meta = TRACK_META[track];
  const trackPhases = phases.filter((p) => p.track === track).sort((a, b) => a.order - b.order);
  const trackKpis = kpis.filter((k) => k.track === track);

  return (
    <div className="track-view">
      <div className="track-intro">
        <h2>{meta.label}</h2>
        <p>{meta.tagline}</p>
      </div>
      {trackKpis.length > 0 && <KpiGrid kpis={trackKpis} />}
      {track === "vvision" && discussionPoints.length > 0 && (
        <DiscussionPoints points={discussionPoints} />
      )}
      <div className="phase-list">
        {trackPhases.map((phase) => (
          <PhaseCard key={phase.id} phase={phase} team={team} />
        ))}
      </div>
    </div>
  );
}
