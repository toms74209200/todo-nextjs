import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const ENV = process.env.NEXT_PUBLIC_ENV || "dev";
const FIREBSE_DOMAIN = process.env.FIREBASE_DOMAIN || "localhost";
const FIREBASE_PORT = process.env.FIREBASE_PORT || "8080";

firebase.initializeApp({
  projectId: "nextjs-todo",
});

ENV === "dev" &&
  firebase.firestore().useEmulator(FIREBSE_DOMAIN, Number(FIREBASE_PORT));
const firestore = firebase.firestore();

export const getFirestoreClient = () => {
  return firestore;
};
