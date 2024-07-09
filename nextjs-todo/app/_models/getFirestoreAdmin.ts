"use server";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  projectId: "nextjs-todo",
});
const firestore = getFirestore();

export const getFirestoreAdmin = async () => {
  return firestore;
};
