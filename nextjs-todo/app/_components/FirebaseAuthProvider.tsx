"use client";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { getFirebaseAuth } from "@/app/_models/loadFirebase";
import { Auth } from "firebase/auth";

export const FirebaseAuthContext = createContext<Auth>(getFirebaseAuth());

const useFirebaseAuth = () => {
  const [auth, setAuth] = useState<Auth>(getFirebaseAuth());

  useEffect(() => {
    setAuth(getFirebaseAuth());
  }, []);

  return auth;
};

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useFirebaseAuth();

  const memoizedAuth = useMemo(() => auth, [auth]);

  return (
    <FirebaseAuthContext.Provider value={memoizedAuth}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
