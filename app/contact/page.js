"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";

const TYPE_OPTS = ["Office", "F&B", "Retail", "Clinic", "HDB", "Condo", "Landed"];
const BUDGET_OPTS = ["Under S$50k", "S$50k – 150k", "S$150k – 500k", "Above S$500k"];
const TIME_OPTS = ["ASAP", "Within 3 months", "3–6 months", "Just exploring"];

function PillButton({ label, active, onClick, pill = true }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? "#EFE7DA" : "rgba(239,231,218,.28)"}`,
        background: active ? "#EFE7DA" : "transparent",
        color: active ? "#221C15" : "rgba(239,231,218,.75)",
        borderRadius: pill ? "99px" : "2px",
        padding: pill ? "9px 18px" : "10px 14px",
        font: pill ? "600 12px Manrope, sans-serif" : "500 12.5px Manrope, sans-serif",
        cursor: "pointer",
        textAlign: pill ? "center" : "left",
      }}
    >
      {label}
    </button>
  );
}

export default function ContactPage() {
  const [type, setType] = useState("Office");
  const [budget, setBudget] = useState("");
  const [time, setTime] = useState("");
  const [sent, setSent] = useState(false);

  // TODO: replace with a Firestore write to `leads` (source: "contact") per README.md.
  const handleSend = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15", minHeight: "100vh" }}>
      <Header />

      {!sent ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "64px", padding: "72px 64px 90px", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "36px", position: "sticky", top: "24px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".32em", color: "oklch(0.74 0.08 78)" }}>CONTACT · 联系我们</span>
              <h1 style={{ margin: 0, font: "italic 500 68px/1.05 'Cormorant Garamond', serif" }}>Start the conversation.</h1>
              <p style={{ margin: 0, font: "400 15px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.65)" }}>
                30 minutes with a director, free, no obligation. Tell us about the space — we&apos;ll tell you what&apos;s possible and what it should cost.
              </p>
            </div>

            <a href="#" style={{ display: "flex", alignItems: "center", gap: "14px", background: "rgba(20,16,11,.5)", border: "1px solid rgba(239,231,218,.14)", borderRadius: "3px", padding: "20px 22px", textDecoration: "none", color: "#EFE7DA" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "99px", background: "#1FA855" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: 1 }}>
                <span style={{ font: "700 14px Manrope, sans-serif" }}>WhatsApp us</span>
                <span style={{ font: "400 12px Manrope, sans-serif", color: "rgba(239,231,218,.55)" }}>+65 [ number ] — replies within the hour, Mon–Sat</span>
              </div>
              <span style={{ font: "600 13px Manrope, sans-serif", color: "oklch(0.74 0.08 78)" }}>→</span>
            </a>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", font: "400 13.5px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.65)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".2em", color: "rgba(239,231,218,.4)" }}>STUDIO</span>
                <span>[ studio address — to be provided ]</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".2em", color: "rgba(239,231,218,.4)" }}>HOURS</span>
                <span>Mon–Fri 9.30am–6.30pm · Sat by appointment</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".2em", color: "rgba(239,231,218,.4)" }}>EMAIL / PHONE</span>
                <span>hello@tdiworkspace.sg · +65 [ number ]</span>
              </div>
            </div>

            <div style={{ height: "220px", border: "1px solid rgba(239,231,218,.14)", borderRadius: "3px", background: "#2A231A", backgroundImage: "repeating-linear-gradient(45deg, rgba(239,231,218,.03) 0 14px, transparent 14px 28px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ font: "400 11px ui-monospace, monospace", letterSpacing: ".1em", color: "rgba(239,231,218,.35)" }}>[ Google Map — studio location ]</span>
            </div>
          </div>

          <form
            onSubmit={handleSend}
            style={{ background: "rgba(20,16,11,.5)", border: "1px solid rgba(239,231,218,.14)", borderRadius: "3px", padding: "38px 40px", display: "flex", flexDirection: "column", gap: "24px" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>NAME *</span>
                <input required type="text" placeholder="Your name" style={{ border: "1px solid rgba(239,231,218,.25)", background: "transparent", color: "#EFE7DA", padding: "13px 15px", font: "400 13.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>PHONE / WHATSAPP *</span>
                <input required type="tel" placeholder="+65" style={{ border: "1px solid rgba(239,231,218,.25)", background: "transparent", color: "#EFE7DA", padding: "13px 15px", font: "400 13.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>EMAIL *</span>
              <input required type="email" placeholder="you@email.com" style={{ border: "1px solid rgba(239,231,218,.25)", background: "transparent", color: "#EFE7DA", padding: "13px 15px", font: "400 13.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>PROJECT TYPE *</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {TYPE_OPTS.map((label) => (
                  <PillButton key={label} label={label} active={type === label} onClick={() => setType(type === label ? "" : label)} />
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>BUDGET RANGE</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {BUDGET_OPTS.map((label) => (
                    <PillButton key={label} label={label} active={budget === label} onClick={() => setBudget(budget === label ? "" : label)} pill={false} />
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>TIMELINE</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {TIME_OPTS.map((label) => (
                    <PillButton key={label} label={label} active={time === label} onClick={() => setTime(time === label ? "" : label)} pill={false} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>PREFERRED CONTACT TIME</span>
                <select style={{ border: "1px solid rgba(239,231,218,.25)", background: "#221C15", color: "#EFE7DA", padding: "13px 15px", font: "400 13.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" }}>
                  <option>Anytime</option>
                  <option>Morning (9–12)</option>
                  <option>Afternoon (12–6)</option>
                  <option>Evening (after 6)</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>HOW DID YOU HEAR ABOUT US?</span>
                <select style={{ border: "1px solid rgba(239,231,218,.25)", background: "#221C15", color: "#EFE7DA", padding: "13px 15px", font: "400 13.5px Manrope, sans-serif", borderRadius: "2px", outline: "none" }}>
                  <option>Google search</option>
                  <option>Referral</option>
                  <option>Instagram</option>
                  <option>Walked past a project</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>TELL US ABOUT THE SPACE</span>
              <textarea rows={4} placeholder="Location, size, what you want it to become…" style={{ border: "1px solid rgba(239,231,218,.25)", background: "transparent", color: "#EFE7DA", padding: "13px 15px", font: "400 13.5px/1.6 Manrope, sans-serif", borderRadius: "2px", outline: "none", resize: "vertical" }} />
            </div>

            <div style={{ border: "1.5px dashed rgba(239,231,218,.25)", borderRadius: "3px", padding: "20px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer" }}>
              <span style={{ font: "400 20px 'Cormorant Garamond', serif", color: "oklch(0.74 0.08 78)" }}>↑</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ font: "600 13px Manrope, sans-serif" }}>Attach floor plan or photos</span>
                <span style={{ font: "400 11.5px Manrope, sans-serif", color: "rgba(239,231,218,.5)" }}>PDF, JPG or PNG — up to 10MB. It makes the first call twice as useful.</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", borderTop: "1px solid rgba(239,231,218,.12)", paddingTop: "22px" }}>
              <span style={{ font: "400 11px/1.6 Manrope, sans-serif", color: "rgba(239,231,218,.4)", maxWidth: "280px" }}>Protected by reCAPTCHA. We reply within one working day and never share your details.</span>
              <button type="submit" style={{ border: 0, background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "16px 30px", font: "700 12px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer", whiteSpace: "nowrap" }}>
                SEND ENQUIRY →
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", padding: "140px 64px", textAlign: "center" }}>
          <span style={{ width: "64px", height: "64px", borderRadius: "99px", border: "1px solid oklch(0.74 0.08 78)", display: "flex", alignItems: "center", justifyContent: "center", font: "400 28px 'Cormorant Garamond', serif", color: "oklch(0.74 0.08 78)" }}>✓</span>
          <h1 style={{ margin: 0, font: "italic 500 56px/1.1 'Cormorant Garamond', serif", maxWidth: "700px" }}>Received — we&apos;ll reply within one working day.</h1>
          <p style={{ margin: 0, font: "400 15px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.65)", maxWidth: "480px" }}>
            A director will review your enquiry personally. If it&apos;s urgent, WhatsApp gets you an answer within the hour.
          </p>
          <div style={{ display: "flex", gap: "14px" }}>
            <Link href="/projects" style={{ border: "1px solid rgba(239,231,218,.4)", color: "#EFE7DA", borderRadius: "2px", padding: "15px 28px", font: "600 12px Manrope, sans-serif", letterSpacing: ".08em", textDecoration: "none" }}>
              BROWSE PROJECTS MEANWHILE
            </Link>
            <button onClick={() => setSent(false)} style={{ border: 0, background: "transparent", color: "rgba(239,231,218,.55)", font: "600 12px Manrope, sans-serif", letterSpacing: ".08em", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "4px" }}>
              SEND ANOTHER ENQUIRY
            </button>
          </div>
        </div>
      )}

      <SimpleFooter showAdmin />
    </div>
  );
}
