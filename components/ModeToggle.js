"use client";

import { useMode } from "@/lib/mode-context";

export default function ModeToggle() {
  const { isC, toC, toR } = useMode();

  return (
    <div style={{ display: "flex", border: "1px solid rgba(239,231,218,.35)", borderRadius: "2px", font: "600 12px Manrope, sans-serif", letterSpacing: ".1em" }}>
      <button
        onClick={toC}
        style={{ border: 0, cursor: "pointer", padding: "13px 26px", background: isC ? "#EFE7DA" : "transparent", color: isC ? "#221C15" : "rgba(239,231,218,.8)", font: "inherit", letterSpacing: "inherit" }}
      >
        COMMERCIAL
      </button>
      <button
        onClick={toR}
        style={{ border: 0, cursor: "pointer", padding: "13px 26px", background: !isC ? "#EFE7DA" : "transparent", color: !isC ? "#221C15" : "rgba(239,231,218,.8)", font: "inherit", letterSpacing: "inherit" }}
      >
        RESIDENTIAL
      </button>
    </div>
  );
}
