"use server";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  projectId: "nextjs-todo",
});
const firestore = getFirestore();
const auth = getAuth();

export const getFirestoreAdmin = async () => {
  return firestore;
};

export const getAuthAdmin = async () => {
  return auth;
};
