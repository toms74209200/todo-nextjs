import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const ENV = process.env.NEXT_PUBLIC_ENV || "dev";
export const FIREBSE_DOMAIN = process.env.FIREBASE_DOMAIN || "localhost";
const FIRESTORE_PORT = process.env.FIRESTORE_PORT || "8080";
const FIREBASE_AUTH_PORT = process.env.FIREBASE_AUTH_PORT || "9099";

initializeApp({
  projectId: "nextjs-todo",
  apiKey: "nextjs-todo",
});

const firestore = getFirestore();
const auth = getAuth();

if (ENV === "dev") {
  connectFirestoreEmulator(firestore, FIREBSE_DOMAIN, Number(FIRESTORE_PORT));
  connectAuthEmulator(auth, `http://localhost:${FIREBASE_AUTH_PORT}`);
}

export const getFirestoreClient = () => {
  return firestore;
};

export const getFirebaseAuth = () => {
  return auth;
};
