"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AdminShell from "@/components/admin/AdminShell";
import DashboardSection from "@/components/admin/DashboardSection";
import HomeSection from "@/components/admin/HomeSection";
import ProjectsSection from "@/components/admin/ProjectsSection";
import JournalSection from "@/components/admin/JournalSection";
import MaterialsSection from "@/components/admin/MaterialsSection";
import ServicesSection from "@/components/admin/ServicesSection";
import AboutSection from "@/components/admin/AboutSection";
import MediaSection from "@/components/admin/MediaSection";
import SeoSection from "@/components/admin/SeoSection";
import LeadsSection from "@/components/admin/LeadsSection";
import UsersSection from "@/components/admin/UsersSection";

const SECTIONS = {
  dashboard: DashboardSection,
  home: HomeSection,
  projects: ProjectsSection,
  journal: JournalSection,
  materials: MaterialsSection,
  services: ServicesSection,
  about: AboutSection,
  media: MediaSection,
  seo: SeoSection,
  leads: LeadsSection,
  users: UsersSection,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(undefined);
  const [section, setSection] = useState("dashboard");

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.replace("/admin/login");
        return;
      }
      setUser(u);
    });
  }, [router]);

  if (user === undefined) {
    return (
      <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.5)" }}>Checking session…</span>
      </div>
    );
  }

  if (!user) return null;

  const Section = SECTIONS[section];

  return (
    <AdminShell section={section} setSection={setSection} user={user}>
      {({ showToast }) => <Section showToast={showToast} navigate={setSection} />}
    </AdminShell>
  );
}
