"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ModeContext = createContext(null);

export function ModeProvider({ children, defaultMode = "C" }) {
  const [mode, setMode] = useState(defaultMode);

  useEffect(() => {
    const stored = localStorage.getItem("tdi-mode");
    if (stored === "C" || stored === "R") setMode(stored);
  }, []);

  const setModeAndPersist = (next) => {
    localStorage.setItem("tdi-mode", next);
    setMode(next);
  };

  return (
    <ModeContext.Provider
      value={{
        mode,
        isC: mode === "C",
        isR: mode === "R",
        toC: () => setModeAndPersist("C"),
        toR: () => setModeAndPersist("R"),
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used within a ModeProvider");
  return ctx;
}
