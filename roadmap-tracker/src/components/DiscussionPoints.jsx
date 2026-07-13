import { toggleDiscussionPoint, updateDiscussionNotes } from "../lib/data";

export default function DiscussionPoints({ points }) {
  const open = points.filter((p) => !p.resolved).length;

  return (
    <div className="discussion-points">
      <div className="discussion-header">
        <h3>Open discussion points</h3>
        <span className="discussion-count">{open} open</span>
      </div>
      <p className="discussion-sub">Items to align on with the partner before/while executing.</p>
      <div className="discussion-list">
        {points.map((p) => (
          <div key={p.id} className={`discussion-item ${p.resolved ? "resolved" : ""}`}>
            <label className="discussion-check">
              <input
                type="checkbox"
                checked={Boolean(p.resolved)}
                onChange={(e) => toggleDiscussionPoint(p.id, e.target.checked)}
              />
              <span>{p.text}</span>
            </label>
            <input
              className="discussion-notes"
              placeholder="Outcome / notes…"
              defaultValue={p.notes || ""}
              onBlur={(e) => {
                if (e.target.value !== (p.notes || "")) updateDiscussionNotes(p.id, e.target.value);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
