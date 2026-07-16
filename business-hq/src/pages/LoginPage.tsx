import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { TEAM_LOGINS } from "../config";

export function LoginPage() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState(TEAM_LOGINS[0]?.email ?? "");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, pin);
    } catch {
      setError("Couldn't sign in — check the PIN.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <form onSubmit={submit} className="animate-fade-in w-full max-w-sm rounded-[var(--radius-card)] border border-line bg-surface p-9 shadow-[var(--shadow-lift)]">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 font-display text-sm font-bold text-white">M</span>
          <div className="text-[11px] font-bold uppercase tracking-widest text-muted">Modula</div>
        </div>
        <h1 className="font-display text-3xl font-semibold text-ink">BusinessHQ</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Sign in to see what needs your attention today.</p>

        {error && <div className="mb-4 rounded-xl bg-danger-50 px-3 py-2 text-sm text-danger-500">{error}</div>}

        <label className="mb-3 block text-xs font-bold text-muted">
          Who's this?
          <select
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
          >
            {TEAM_LOGINS.map((p) => <option key={p.email} value={p.email}>{p.name}</option>)}
          </select>
        </label>

        <label className="mb-6 block text-xs font-bold text-muted">
          PIN
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            autoComplete="off"
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-sage-600 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-soft)] transition hover:bg-sage-700 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
