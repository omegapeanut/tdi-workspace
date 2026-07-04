"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getHomeSettings, getAllProjects, getAllArticles, getServicesSettings } from "@/lib/cms";

const HomeCmsContext = createContext(null);

export function HomeCmsProvider({ children }) {
  const [state, setState] = useState({ loading: true, home: null, projects: [], articles: [], services: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      const [home, projects, articles, services] = await Promise.all([
        getHomeSettings(),
        getAllProjects(),
        getAllArticles(),
        getServicesSettings(),
      ]);
      if (alive) setState({ loading: false, home, projects, articles, services });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return <HomeCmsContext.Provider value={state}>{children}</HomeCmsContext.Provider>;
}

export function useHomeCms() {
  const ctx = useContext(HomeCmsContext);
  if (!ctx) throw new Error("useHomeCms must be used within HomeCmsProvider");
  return ctx;
}
