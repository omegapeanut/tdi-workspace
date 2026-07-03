import Link from "next/link";

export default function SimpleFooter({ showAdmin = false }) {
  return (
    <div style={{ background: "#1A150F", padding: "28px 64px", display: "flex", justifyContent: "space-between", font: "400 11.5px Manrope, sans-serif", color: "rgba(239,231,218,.35)" }}>
      <span>© 2026 TDI Workspace Pte Ltd</span>
      {showAdmin ? (
        <div style={{ display: "flex", gap: "24px" }}>
          <Link href="/" style={{ color: "rgba(239,231,218,.55)", textDecoration: "none" }}>← Back to home</Link>
          <Link href="/admin/login" style={{ color: "rgba(239,231,218,.55)", textDecoration: "none" }}>Admin</Link>
        </div>
      ) : (
        <Link href="/" style={{ color: "rgba(239,231,218,.55)", textDecoration: "none" }}>← Back to home</Link>
      )}
    </div>
  );
}
