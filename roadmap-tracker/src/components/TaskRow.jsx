import { useState } from "react";
import { STATUS_META, STATUS_ORDER } from "../lib/constants";
import { updateTaskField } from "../lib/data";

export default function TaskRow({ phaseId, taskId, task, team }) {
  const [notesOpen, setNotesOpen] = useState(Boolean(task.notes));
  const [notesDraft, setNotesDraft] = useState(task.notes || "");
  const status = task.status || "todo";
  const owner = team.find((m) => m.id === task.ownerId);

  function cycleStatus() {
    const idx = STATUS_ORDER.indexOf(status);
    const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
    updateTaskField(phaseId, taskId, "status", next);
  }

  function saveNotes() {
    if (notesDraft !== (task.notes || "")) {
      updateTaskField(phaseId, taskId, "notes", notesDraft);
    }
  }

  return (
    <div className={`task-row ${status === "done" ? "task-done" : ""}`}>
      <button
        type="button"
        className={`status-pill ${STATUS_META[status].className}`}
        onClick={cycleStatus}
        title="Click to change status"
      >
        {STATUS_META[status].label}
      </button>
      <div className="task-main">
        <div className="task-title">{task.title}</div>
        <div className="task-controls">
          <select
            className="owner-select"
            value={task.ownerId || ""}
            onChange={(e) => updateTaskField(phaseId, taskId, "ownerId", e.target.value || null)}
            style={owner ? { borderColor: owner.color } : undefined}
          >
            <option value="">Unassigned</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <button type="button" className="link-btn" onClick={() => setNotesOpen((v) => !v)}>
            {task.notes ? "Notes" : "+ Note"}
          </button>
        </div>
        {notesOpen && (
          <textarea
            className="task-notes"
            placeholder="Add a note for the team…"
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            onBlur={saveNotes}
            rows={2}
          />
        )}
      </div>
    </div>
  );
}
