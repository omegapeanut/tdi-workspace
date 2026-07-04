export default function WhatsAppButton() {
  return (
    <div
      style={{
        position: "fixed",
        right: "min(28px, 4vw)",
        bottom: "20px",
        maxWidth: "calc(100vw - 32px)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#EFE7DA",
        color: "#221C15",
        borderRadius: "99px",
        padding: "14px 20px",
        font: "700 13px Manrope, sans-serif",
        boxShadow: "0 14px 36px rgba(0,0,0,.45)",
        cursor: "pointer",
        zIndex: 50,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      <span style={{ flexShrink: 0, width: "9px", height: "9px", borderRadius: "99px", background: "#1FA855" }} />
      <span>WhatsApp us</span>
      <span className="hide-mobile">— replies within the hour</span>
    </div>
  );
}
