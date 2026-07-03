import Link from "next/link";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/journal", label: "Journal" },
  { href: "/materials", label: "Materials" },
  { href: "/about", label: "About" },
  { href: "/calculator", label: "Calculator" },
];

export default function Header() {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "26px 64px",
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "baseline", gap: "9px", textDecoration: "none" }}>
        <span style={{ font: "500 24px 'Cormorant Garamond', serif", color: "#EFE7DA" }}>TDI</span>
        <span style={{ font: "600 10px Manrope, sans-serif", letterSpacing: ".3em", color: "oklch(0.74 0.08 78)" }}>
          WORKSPACE
        </span>
      </Link>
      <nav style={{ display: "flex", gap: "32px", font: "500 12.5px Manrope, sans-serif", color: "rgba(239,231,218,.75)" }}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} style={{ color: "rgba(239,231,218,.75)", textDecoration: "none" }}>
            {link.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/contact"
        style={{
          border: "1px solid oklch(0.74 0.08 78)",
          background: "transparent",
          color: "oklch(0.74 0.08 78)",
          borderRadius: "2px",
          padding: "11px 22px",
          font: "600 11.5px Manrope, sans-serif",
          letterSpacing: ".08em",
          textDecoration: "none",
        }}
      >
        BOOK A CONSULTATION
      </Link>
    </div>
  );
}
