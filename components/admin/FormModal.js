"use client";

const fieldInput = { border: "1px solid rgba(34,28,21,.25)", background: "#fff", color: "#26221C", padding: "12px 14px", font: "400 13.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" };

export default function FormModal({ title, onCancel, onSave, saving, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(23,19,16,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
      <div style={{ background: "#FBF8F2", borderRadius: "4px", padding: "28px 30px", display: "flex", flexDirection: "column", gap: "16px", width: "480px", maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,.4)" }}>
        <span style={{ font: "italic 500 24px 'Cormorant Garamond', serif", color: "#26221C" }}>{title}</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>{children}</div>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button onClick={onCancel} style={{ border: "1px solid rgba(34,28,21,.3)", background: "transparent", color: "#26221C", borderRadius: "2px", padding: "11px 18px", font: "600 11.5px Manrope, sans-serif", letterSpacing: ".06em", cursor: "pointer" }}>
            CANCEL
          </button>
          <button onClick={onSave} disabled={saving} style={{ border: 0, background: "#26221C", color: "#EFE7DA", borderRadius: "2px", padding: "11px 20px", font: "600 11.5px Manrope, sans-serif", letterSpacing: ".06em", cursor: saving ? "default" : "pointer", opacity: saving ? 0.6 : 1 }}>
            {saving ? "SAVING…" : "SAVE & GO LIVE"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".12em", color: "#8A8172" }}>{label}</span>
      {children}
    </div>
  );
}

export function TextInput(props) {
  return <input type="text" style={fieldInput} {...props} />;
}

export function Select({ options, ...props }) {
  return (
    <select style={fieldInput} {...props}>
      {options.map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}

export function TextArea(props) {
  return <textarea style={{ ...fieldInput, resize: "vertical", font: "400 13.5px/1.6 Manrope, sans-serif" }} {...props} />;
}
