import Link from "next/link";

export default function Footer() {
  return (
    <div style={{ background: "#1A150F", padding: "72px 64px 110px", display: "flex", flexDirection: "column", gap: "56px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.2fr", gap: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "9px" }}>
            <span style={{ font: "500 24px 'Cormorant Garamond', serif" }}>TDI</span>
            <span style={{ font: "600 10px Manrope, sans-serif", letterSpacing: ".3em", color: "oklch(0.74 0.08 78)" }}>WORKSPACE</span>
          </div>
          <span style={{ font: "400 13px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.55)", maxWidth: "300px" }}>
            Commercial-first interior design &amp; build in Singapore. Homes handled with the same rigour.
          </span>
          <span style={{ font: "400 12px 'Noto Serif SC', serif", color: "rgba(239,231,218,.35)" }}>匠心营造 · 家的质感</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".2em", color: "rgba(239,231,218,.4)" }}>EXPLORE</span>
          <Link href="/projects" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Projects</Link>
          <Link href="/services" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Services</Link>
          <Link href="/process" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Process</Link>
          <Link href="/journal" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Journal</Link>
          <Link href="/materials" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Material library</Link>
          <Link href="/about" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>About</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".2em", color: "rgba(239,231,218,.4)" }}>START</span>
          <Link href="/contact" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Book a consultation</Link>
          <Link href="/contact" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Request a proposal</Link>
          <Link href="/calculator" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Renovation calculator</Link>
          <Link href="/contact" style={{ color: "rgba(239,231,218,.6)", textDecoration: "none" }}>Download company profile</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", font: "400 13px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".2em", color: "rgba(239,231,218,.4)" }}>VISIT</span>
          <span>[ studio address — to be provided ]</span>
          <span>Mon–Fri 9.30am–6.30pm · Sat by appointment</span>
          <span>hello@tdiworkspace.sg · +65 [ number ]</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(239,231,218,.1)",
          paddingTop: "24px",
          font: "400 11.5px Manrope, sans-serif",
          color: "rgba(239,231,218,.35)",
        }}
      >
        <span>© 2026 TDI Workspace Pte Ltd · BCA-registered · bizSAFE 3 · HDB-licensed</span>
        <div style={{ display: "flex", gap: "24px" }}>
          <span style={{ cursor: "pointer" }}>Instagram</span>
          <span style={{ cursor: "pointer" }}>LinkedIn</span>
          <span style={{ cursor: "pointer" }}>Privacy</span>
          <Link href="/admin/login" style={{ color: "rgba(239,231,218,.35)", textDecoration: "none" }}>Admin</Link>
        </div>
      </div>
    </div>
  );
}
