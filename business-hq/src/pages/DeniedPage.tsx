import { useAuth } from "../context/AuthContext";
import { loginName } from "../config";

export function DeniedPage() {
  const { firebaseUser, signOut } = useAuth();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="max-w-sm text-sm text-muted">
        {loginName(firebaseUser?.email)} is signed in but isn't set up in BusinessHQ yet. Ask an Owner or Admin to add your account.
      </p>
      <button type="button" onClick={() => signOut()} className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink-soft hover:bg-surface-soft">
        Sign out
      </button>
    </div>
  );
}
