import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppButton from "@/components/WhatsAppButton";

const stats = [
  { value: "200+", label: "PROJECTS ACROSS SINGAPORE" },
  { value: "15", label: "YEARS OF DESIGN & BUILD" },
  { value: "28", label: "DESIGNERS, PMS & CRAFTSMEN" },
  { value: "70%", label: "OF WORK FROM REFERRALS" },
];

const team = [
  { img: "/images/team-1.jpg", alt: "Design Director", name: "[ Name ]", role: "DESIGN DIRECTOR", bio: "Leads concept and space planning. 14 years across workplace and hospitality." },
  { img: "/images/team-2.jpg", alt: "Projects Director", name: "[ Name ]", role: "PROJECTS DIRECTOR", bio: "Owns every build programme and the Friday photo report. Ex-main-contractor." },
  { img: "/images/team-3.jpg", alt: "Client Director", name: "[ Name ]", role: "CLIENT DIRECTOR", bio: "Your first call and your last sign-off — from consultation to defects care." },
];

const credentials = [
  { title: "BCA-registered", body: "Registered with the Building & Construction Authority for interior works." },
  { title: "HDB-licensed contractor", body: "Listed on the HDB Directory of Renovation Contractors." },
  { title: "bizSAFE Level 3", body: "Workplace safety & health management certified; fully insured works." },
];

export default function AboutPage() {
  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <Header />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", padding: "80px 64px", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>ABOUT THE STUDIO · EST. 2011</span>
          <h1 style={{ margin: 0, font: "italic 500 68px/1.06 'Cormorant Garamond', serif" }}>Builders first, designers always.</h1>
          <p style={{ margin: 0, font: "400 15.5px/1.8 Manrope, sans-serif", color: "rgba(239,231,218,.7)" }}>
            TDI Workspace started on the contractor&apos;s side of the table — which is why our drawings survive contact with the site. Fifteen years on, we design and build commercial spaces first and homes with the same rigour: one contract, one accountable team, one number we stand behind.
          </p>
          <p style={{ margin: 0, font: "400 15.5px/1.8 Manrope, sans-serif", color: "rgba(239,231,218,.7)" }}>
            We stay deliberately mid-sized. Every project is led by a director, not handed down — that&apos;s the difference clients feel at week six, when decisions need someone who can actually make them.
          </p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/about-studio.jpg" alt="TDI Workspace studio" style={{ height: "560px", width: "100%", objectFit: "cover", display: "block" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1px", background: "rgba(239,231,218,.12)", borderTop: "1px solid rgba(239,231,218,.12)", borderBottom: "1px solid rgba(239,231,218,.12)" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "#221C15", padding: "34px 28px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ font: "400 46px 'Cormorant Garamond', serif", color: "oklch(0.74 0.08 78)" }}>{stat.value}</span>
            <span style={{ font: "500 11.5px Manrope, sans-serif", letterSpacing: ".12em", color: "rgba(239,231,218,.55)" }}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "90px 64px", display: "flex", flexDirection: "column", gap: "48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>THE PEOPLE</span>
          <h2 style={{ margin: 0, font: "italic 500 50px/1.1 'Cormorant Garamond', serif" }}>Led by directors, not departments.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "22px" }}>
          {team.map((member) => (
            <div key={member.role} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={member.img} alt={member.alt} style={{ height: "400px", width: "100%", objectFit: "cover", display: "block", filter: "grayscale(35%)" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ font: "italic 500 24px 'Cormorant Garamond', serif" }}>{member.name}</span>
                <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".16em", color: "oklch(0.74 0.08 78)" }}>{member.role}</span>
                <span style={{ font: "400 13px/1.6 Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>{member.bio}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#EFE7DA", color: "#221C15", padding: "90px 64px", display: "flex", flexDirection: "column", gap: "44px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.55 0.09 70)" }}>CREDENTIALS</span>
          <h2 style={{ margin: 0, font: "italic 500 50px/1.1 'Cormorant Garamond', serif" }}>Licensed, insured, accountable.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1px", background: "rgba(34,28,21,.14)", border: "1px solid rgba(34,28,21,.14)" }}>
          {credentials.map((c) => (
            <div key={c.title} style={{ background: "#EFE7DA", padding: "30px 28px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ font: "700 15px Manrope, sans-serif" }}>{c.title}</span>
              <span style={{ font: "400 13px/1.6 Manrope, sans-serif", color: "#5C5546" }}>{c.body}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap", borderTop: "1px solid rgba(34,28,21,.18)", paddingTop: "32px" }}>
          <span style={{ font: "500 11px Manrope, sans-serif", letterSpacing: ".2em", color: "#8A8172" }}>TRUSTED BY TEAMS AT</span>
          {["NOVA BANK", "Herring & Co.", "KOPI CULTURE", "Atlas Retail", "MEDFIRST CLINICS"].map((n) => (
            <span key={n} style={{ font: "600 15px Manrope, sans-serif", color: "#8A8172" }}>{n}</span>
          ))}
        </div>
      </div>

      <div style={{ padding: "80px 64px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ font: "italic 500 36px 'Cormorant Garamond', serif" }}>Work with people who build what they draw.</span>
          <span style={{ font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>30 minutes, free, with a director — not a salesperson.</span>
        </div>
        <Link href="/contact" style={{ display: "inline-block", background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "16px 30px", font: "700 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}>
          BOOK A FREE CONSULTATION
        </Link>
      </div>

      <SimpleFooter />
      <WhatsAppButton />
    </div>
  );
}
