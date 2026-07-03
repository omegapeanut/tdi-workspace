import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import ProofTestimonial from "@/components/home/ProofTestimonial";
import ProcessJournal from "@/components/home/ProcessJournal";
import FinalCta from "@/components/home/FinalCta";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15" }}>
      <Hero />
      <Services />
      <FeaturedProjects />
      <ProofTestimonial />
      <ProcessJournal />
      <FinalCta />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
