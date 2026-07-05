"use client";

import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProofTestimonial from "@/components/home/ProofTestimonial";
import ProcessJournal from "@/components/home/ProcessJournal";
import FinalCta from "@/components/home/FinalCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CmsLoading from "@/components/CmsLoading";
import SeoHead from "@/components/SeoHead";
import { HomeCmsProvider, useHomeCms } from "@/lib/home-cms-context";

function isHiatusActive(hiatus) {
  if (!hiatus?.from || !hiatus?.to) return false;
  const today = new Date().toISOString().slice(0, 10);
  return today >= hiatus.from && today <= hiatus.to;
}

function NoticeBar({ home }) {
  const hiatusActive = isHiatusActive(home.hiatus);
  const text = hiatusActive
    ? `On hiatus until ${home.hiatus.to} — replies may be slower than usual.`
    : home.announcement;
  if (!text) return null;
  return (
    <div className="px-page" style={{ background: "#1A150F", borderBottom: "1px solid rgba(239,231,218,.1)", padding: "12px 0", textAlign: "center" }}>
      <span style={{ font: "600 12px Manrope, sans-serif", color: "oklch(0.74 0.08 78)" }}>{text}</span>
    </div>
  );
}

function HomeContent() {
  const { loading, home } = useHomeCms();

  if (loading) {
    return (
      <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
        <CmsLoading />
      </div>
    );
  }

  return (
    <>
      <SeoHead />
      <NoticeBar home={home} />
      <Hero />
      <Services />
      <FeaturedProjects />
      <ProofTestimonial />
      <ProcessJournal />
      <FinalCta />
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function Home() {
  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15" }}>
      <HomeCmsProvider>
        <HomeContent />
      </HomeCmsProvider>
    </div>
  );
}
