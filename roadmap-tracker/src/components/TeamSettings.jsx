import { useState } from "react";
import { setTeamMembers } from "../lib/data";
import { MEMBER_COLORS } from "../lib/constants";

export default function TeamSettings({ team }) {
  const [draft, setDraft] = useState(team);
  const [saved, setSaved] = useState(false);

  function updateName(id, name) {
    setDraft((d) => d.map((m) => (m.id === id ? { ...m, name } : m)));
  }

  function addMember() {
    const id = `m${Date.now()}`;
    const color = MEMBER_COLORS[draft.length % MEMBER_COLORS.length];
    setDraft((d) => [...d, { id, name: "New teammate", color }]);
  }

  function removeMember(id) {
    setDraft((d) => d.filter((m) => m.id !== id));
  }

  async function save() {
    await setTeamMembers(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="team-settings">
      <h2>Team</h2>
      <p>These are the people tasks can be assigned to. Renaming here updates everywhere instantly.</p>
      <div className="team-list">
        {draft.map((m) => (
          <div className="team-row" key={m.id}>
            <span className="dot" style={{ background: m.color }} />
            <input value={m.name} onChange={(e) => updateName(m.id, e.target.value)} />
            <button type="button" className="link-btn" onClick={() => removeMember(m.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="team-actions">
        <button type="button" className="secondary-btn" onClick={addMember}>
          + Add teammate
        </button>
        <button type="button" className="primary-btn" onClick={save}>
          {saved ? "Saved ✓" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
