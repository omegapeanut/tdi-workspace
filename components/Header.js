"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/process", label: "Process" },
  { href: "/journal", label: "Journal" },
  { href: "/materials", label: "Materials" },
  { href: "/about", label: "About" },
  { href: "/calculator", label: "Calculator" },
];

export default function Header({ bordered = true }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div
      className="px-page"
      style={{
        position: "relative",
        borderBottom: bordered ? "1px solid rgba(239,231,218,.1)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 0",
          gap: "16px",
        }}
      >
        <Link
          href="/"
          onClick={() => setOpen(false)}
          style={{ display: "flex", alignItems: "baseline", gap: "9px", textDecoration: "none" }}
        >
          <span style={{ font: "500 24px 'Cormorant Garamond', serif", color: "#EFE7DA" }}>TDI</span>
          <span style={{ font: "600 10px Manrope, sans-serif", letterSpacing: ".3em", color: "oklch(0.74 0.08 78)" }}>
            WORKSPACE
          </span>
        </Link>

        <nav
          className="nav-desktop"
          style={{ alignItems: "center", gap: "32px", font: "500 12.5px Manrope, sans-serif", color: "rgba(239,231,218,.75)" }}
        >
          {navLinks.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: active ? "#EFE7DA" : "rgba(239,231,218,.75)",
                  textDecoration: "none",
                  borderBottom: active ? "1px solid oklch(0.74 0.08 78)" : "1px solid transparent",
                  paddingBottom: "3px",
                  whiteSpace: "nowrap",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="nav-desktop"
          style={{
            border: "1px solid oklch(0.74 0.08 78)",
            background: "transparent",
            color: "oklch(0.74 0.08 78)",
            borderRadius: "2px",
            padding: "11px 22px",
            font: "600 11.5px Manrope, sans-serif",
            letterSpacing: ".08em",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          BOOK A CONSULTATION
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="nav-toggle"
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            border: "1px solid rgba(239,231,218,.3)",
            background: "transparent",
            borderRadius: "2px",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <span style={{ position: "relative", width: "18px", height: "13px", display: "block" }}>
            <span style={barStyle(open, "top")} />
            <span style={barStyle(open, "middle")} />
            <span style={barStyle(open, "bottom")} />
          </span>
        </button>
      </div>

      <div
        className={`nav-mobile-panel${open ? " open" : ""}`}
        style={{
          flexDirection: "column",
          gap: "2px",
          paddingBottom: "24px",
          font: "500 15px Manrope, sans-serif",
        }}
      >
        {navLinks.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                padding: "14px 4px",
                color: active ? "#EFE7DA" : "rgba(239,231,218,.75)",
                textDecoration: "none",
                borderTop: "1px solid rgba(239,231,218,.08)",
              }}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/contact"
          onClick={() => setOpen(false)}
          style={{
            marginTop: "14px",
            textAlign: "center",
            border: "1px solid oklch(0.74 0.08 78)",
            background: "transparent",
            color: "oklch(0.74 0.08 78)",
            borderRadius: "2px",
            padding: "13px 22px",
            font: "600 12px Manrope, sans-serif",
            letterSpacing: ".08em",
            textDecoration: "none",
          }}
        >
          BOOK A CONSULTATION
        </Link>
      </div>
    </div>
  );
}

function barStyle(open, position) {
  const base = {
    position: "absolute",
    left: 0,
    right: 0,
    height: "1.5px",
    background: "#EFE7DA",
    transition: "transform .2s ease, opacity .2s ease",
  };
  if (position === "top") {
    return { ...base, top: open ? "6px" : "0", transform: open ? "rotate(45deg)" : "none" };
  }
  if (position === "middle") {
    return { ...base, top: "6px", opacity: open ? 0 : 1 };
  }
  return { ...base, top: open ? "6px" : "12px", transform: open ? "rotate(-45deg)" : "none" };
}
