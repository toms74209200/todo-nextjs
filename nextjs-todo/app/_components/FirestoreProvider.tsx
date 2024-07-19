"use client";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { getFirestoreClient } from "@/app/_models/loadFirebase";
import { Firestore } from "firebase/firestore";

export const FirestoreContext = createContext<Firestore>(getFirestoreClient());

const useFirestore = () => {
  const [firestore, setFirestore] = useState<Firestore>(getFirestoreClient());

  useEffect(() => {
    setFirestore(getFirestoreClient());
  }, []);

  return firestore;
};

export const FirestoreProvider = ({ children }: { children: ReactNode }) => {
  const firestore = useFirestore();

  const memoizedFirestore = useMemo(() => firestore, [firestore]);

  return (
    <FirestoreContext.Provider value={memoizedFirestore}>
      {children}
    </FirestoreContext.Provider>
  );
};
