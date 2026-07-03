export default function WhatsAppButton() {
  return (
    <div
      style={{
        position: "fixed",
        right: "28px",
        bottom: "28px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#EFE7DA",
        color: "#221C15",
        borderRadius: "99px",
        padding: "14px 22px",
        font: "700 13px Manrope, sans-serif",
        boxShadow: "0 14px 36px rgba(0,0,0,.45)",
        cursor: "pointer",
        zIndex: 50,
      }}
    >
      <span style={{ width: "9px", height: "9px", borderRadius: "99px", background: "#1FA855" }} />
      WhatsApp us — replies within the hour
    </div>
  );
}
