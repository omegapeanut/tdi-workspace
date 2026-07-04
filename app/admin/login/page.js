"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { withBasePath } from "@/lib/basePath";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, pw);
      router.push("/admin");
    } catch (error) {
      setErr("Incorrect email or password.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="admin-login-grid" style={{ fontFamily: "Manrope, sans-serif", color: "#EFE7DA", background: "#221C15" }}>
      <div className="admin-login-image" style={{ position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBasePath("/images/hero-commercial.jpg")}
          alt="TDI project"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(20,16,11,.4), rgba(20,16,11,.85))" }} />
        <div style={{ position: "absolute", left: "52px", bottom: "52px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <span style={{ font: "italic 500 34px/1.2 'Cormorant Garamond', serif", maxWidth: "400px" }}>
            Everything on the site, editable from one desk.
          </span>
          <span style={{ font: "400 13px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>TDI Workspace content management</span>
        </div>
      </div>

      <div className="px-page" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "64px 0" }}>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "380px", display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "9px" }}>
              <span style={{ font: "500 28px 'Cormorant Garamond', serif" }}>TDI</span>
              <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".3em", color: "oklch(0.74 0.08 78)" }}>ADMIN</span>
            </div>
            <span style={{ font: "400 13.5px Manrope, sans-serif", color: "rgba(239,231,218,.6)" }}>Sign in to manage the website.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>EMAIL</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@tdiworkspace.sg"
                style={{ border: "1px solid rgba(239,231,218,.3)", background: "rgba(20,16,11,.5)", color: "#EFE7DA", padding: "14px 16px", font: "400 14px Manrope, sans-serif", borderRadius: "2px", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".14em", color: "rgba(239,231,218,.55)" }}>PASSWORD</span>
              <input
                required
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="••••••••"
                style={{ border: "1px solid rgba(239,231,218,.3)", background: "rgba(20,16,11,.5)", color: "#EFE7DA", padding: "14px 16px", font: "400 14px Manrope, sans-serif", borderRadius: "2px", outline: "none" }}
              />
            </div>
            {err && <span style={{ font: "500 12.5px Manrope, sans-serif", color: "#E08558" }}>{err}</span>}
            <button
              type="submit"
              disabled={signingIn}
              style={{ display: "block", textAlign: "center", border: 0, background: "oklch(0.74 0.08 78)", color: "#221C15", borderRadius: "2px", padding: "15px 24px", font: "700 12px Manrope, sans-serif", letterSpacing: ".1em", cursor: signingIn ? "default" : "pointer", opacity: signingIn ? 0.6 : 1, marginTop: "6px" }}
            >
              {signingIn ? "SIGNING IN…" : "SIGN IN →"}
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", font: "500 12px Manrope, sans-serif", color: "rgba(239,231,218,.5)" }}>
              <span style={{ cursor: "pointer" }}>Forgot password?</span>
              <span>2FA enabled</span>
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(239,231,218,.12)", paddingTop: "18px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ font: "600 10.5px Manrope, sans-serif", letterSpacing: ".18em", color: "rgba(239,231,218,.4)" }}>ROLES</span>
            <span style={{ font: "400 12px/1.7 Manrope, sans-serif", color: "rgba(239,231,218,.45)" }}>
              Admin · Manager · Editor · Marketing · Read-only — access is role-based; editors see only content sections.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
