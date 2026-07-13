import { useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";

export function useAuth() {
  const [state, setState] = useState({ loading: true, user: null, isMember: null });

  useEffect(() => {
    let unsubMember = () => {};
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      unsubMember();
      if (!user) {
        setState({ loading: false, user: null, isMember: null });
        return;
      }
      setState((s) => ({ ...s, loading: true, user }));
      unsubMember = onSnapshot(doc(db, "roadmapMembers", user.uid), (snap) => {
        setState({ loading: false, user, isMember: snap.exists() });
      });
    });
    return () => {
      unsubAuth();
      unsubMember();
    };
  }, []);

  return state;
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export function logout() {
  return signOut(auth);
}
