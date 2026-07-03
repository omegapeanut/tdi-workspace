import Link from "next/link";

export default function SimpleFooter() {
  return (
    <div style={{ background: "#1A150F", padding: "28px 64px", display: "flex", justifyContent: "space-between", font: "400 11.5px Manrope, sans-serif", color: "rgba(239,231,218,.35)" }}>
      <span>© 2026 TDI Workspace Pte Ltd</span>
      <Link href="/" style={{ color: "rgba(239,231,218,.55)", textDecoration: "none" }}>← Back to home</Link>
    </div>
  );
}
