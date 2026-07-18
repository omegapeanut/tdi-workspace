import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { PIN_PREFIX } from "../config";
import type { User } from "../types";

type AuthPhase = "loading" | "signed_out" | "not_provisioned" | "signed_in";

interface AuthState {
  phase: AuthPhase;
  firebaseUser: FirebaseUser | null;
  profile: User | null;
  signIn: (email: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<AuthPhase>("loading");
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      unsubProfile?.();
      unsubProfile = null;
      setFirebaseUser(user);

      if (!user) {
        setProfile(null);
        setPhase("signed_out");
        return;
      }

      unsubProfile = onSnapshot(
        doc(db, "hqUsers", user.uid),
        (snap) => {
          if (!snap.exists() || snap.data().status === "deleted") {
            setProfile(null);
            setPhase("not_provisioned");
            return;
          }
          setProfile({ id: snap.id, ...(snap.data() as Omit<User, "id">) });
          setPhase("signed_in");
        },
        () => {
          setProfile(null);
          setPhase("not_provisioned");
        },
      );
    });

    return () => {
      unsubAuth();
      unsubProfile?.();
    };
  }, []);

  const value: AuthState = {
    phase,
    firebaseUser,
    profile,
    signIn: async (email, pin) => {
      await signInWithEmailAndPassword(auth, email, PIN_PREFIX + pin);
    },
    signOut: async () => {
      await firebaseSignOut(auth);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
