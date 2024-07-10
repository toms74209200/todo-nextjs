"use client";
import firebase from "firebase/compat/app";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { getFirestoreClient } from "@/app/_models/getFirestoreClient";

export const FirestoreContext = createContext<firebase.firestore.Firestore>(
  getFirestoreClient()
);

const useFirestore = () => {
  const [firestore, setFirestore] = useState<firebase.firestore.Firestore>(
    getFirestoreClient()
  );

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
