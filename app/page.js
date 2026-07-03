export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#221C15",
        color: "#EFE7DA",
        fontFamily: "Manrope, system-ui, sans-serif",
        textAlign: "center",
        padding: "24px",
      }}
    >
      <p
        style={{
          textTransform: "uppercase",
          letterSpacing: ".3em",
          fontSize: "12px",
          color: "oklch(0.74 0.08 78)",
          marginBottom: "16px",
        }}
      >
        TDI Workspace
      </p>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 500,
          fontSize: "clamp(28px, 5vw, 48px)",
          margin: 0,
        }}
      >
        Site under construction
      </h1>
      <p style={{ color: "#8A8172", marginTop: "16px", maxWidth: "480px" }}>
        The full experience is being built out. Check back soon.
      </p>
    </main>
  );
}
