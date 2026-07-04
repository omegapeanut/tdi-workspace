import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { processDetailSteps, processFaqs } from "@/lib/process";

export default function ProcessPage() {
  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <Header />

      <div className="px-page" style={{ padding: "clamp(48px, 8vw, 72px) 0 clamp(32px, 6vw, 56px)", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
        <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>HOW IT WORKS · 六步交付</span>
        <h1 style={{ margin: 0, font: "italic 500 clamp(2.25rem, 4vw + 1rem, 4.75rem)/1.1 'Cormorant Garamond', serif" }}>Six steps, no surprises.</h1>
        <p style={{ margin: 0, font: "400 15.5px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.65)", maxWidth: "640px" }}>
          Every project — a 12,000 sqft office or a 4-room flat — moves through the same six gates. You always know which one you&apos;re at, what&apos;s been decided, and what it costs.
        </p>
      </div>

      <div className="px-page" style={{ padding: "0 0 80px", display: "flex", flexDirection: "column" }}>
        {processDetailSteps.map((st) => (
          <div key={st.num} className="grid-process-step" style={{ gap: "32px", padding: "46px 0", borderTop: "1px solid rgba(239,231,218,.12)", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ font: "400 56px 'Cormorant Garamond', serif", color: "oklch(0.74 0.08 78)" }}>{st.num}</span>
              <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".2em", color: "rgba(239,231,218,.45)" }}>{st.dur}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ font: "italic 500 30px 'Cormorant Garamond', serif" }}>{st.name}</span>
              <span style={{ font: "400 14px/1.75 Manrope, sans-serif", color: "rgba(239,231,218,.65)" }}>{st.desc}</span>
            </div>
            <div style={{ background: "rgba(20,16,11,.5)", border: "1px solid rgba(239,231,218,.12)", borderRadius: "3px", padding: "22px 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".2em", color: "oklch(0.74 0.08 78)" }}>YOU WALK AWAY WITH</span>
              {st.outputs.map((o) => (
                <span key={o} style={{ font: "400 13px/1.5 Manrope, sans-serif", color: "rgba(239,231,218,.7)" }}>· {o}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="px-page" style={{ background: "#EFE7DA", color: "#221C15", padding: "clamp(48px, 8vw, 90px) 0", display: "flex", flexDirection: "column", gap: "44px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.55 0.09 70)" }}>COMMON QUESTIONS</span>
          <h2 style={{ margin: 0, font: "italic 500 clamp(1.875rem, 2vw + 1.25rem, 3.125rem)/1.1 'Cormorant Garamond', serif" }}>Asked before every project.</h2>
        </div>
        <div className="grid-2" style={{ gap: "40px 48px" }}>
          {processFaqs.map((faq) => (
            <div key={faq.q} style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid rgba(34,28,21,.2)", paddingTop: "20px" }}>
              <span style={{ font: "700 15px Manrope, sans-serif" }}>{faq.q}</span>
              <span style={{ font: "400 13.5px/1.7 Manrope, sans-serif", color: "#5C5546" }}>{faq.a}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-page stack-mobile" style={{ padding: "clamp(48px, 8vw, 80px) 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ font: "italic 500 36px 'Cormorant Garamond', serif" }}>Step one is a conversation.</span>
          <span style={{ font: "400 14px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>30 minutes, free, no obligation — and you keep the budget band we sketch.</span>
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
