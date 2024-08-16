import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { deleteTodo } from "./deleteTodo";
import { getFirestoreAdmin } from "./loadFirebaseAdmin";
import { FIREBSE_DOMAIN, getFirebaseAuth } from "./loadFirebase";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInAnonymously,
} from "firebase/auth";
import { Firestore } from "firebase-admin/firestore";

const authClient = getFirebaseAuth();
let firestoreAdmin: Firestore;

describe("Test for deleteTodo", { retry: 10 }, () => {
  beforeAll(async () => {
    firestoreAdmin = await getFirestoreAdmin();
  });

  afterAll(async () => {
    if (process.env.ENV === "ci") {
      return;
    }
    await fetch(
      `http://${FIREBSE_DOMAIN}:8080/emulator/v1/projects/nextjs-todo/databases/(default)/documents`,
      { method: "DELETE" }
    );
    await fetch(
      `http://${FIREBSE_DOMAIN}:9099/emulator/v1/projects/nextjs-todo/accounts`,
      {
        method: "DELETE",
      }
    );
  });

  test("success", async () => {
    const userCredential = await signInAnonymously(authClient);

    const docRef = await firestoreAdmin
      .collection("users")
      .doc(userCredential.user.uid)
      .collection("todos")
      .add({
        title: crypto.getRandomValues(new Uint32Array(1))[0].toString(),
        completed: false,
      });

    const idToken = await getIdToken(userCredential.user);

    await deleteTodo(idToken, userCredential.user.uid, docRef.id);

    const snapshot = await firestoreAdmin
      .collection("users")
      .doc(userCredential.user.uid)
      .collection("todos")
      .get();
    const todos = snapshot.docs.map((doc) => doc.data());
    expect(todos).toEqual([]);
  });

  test("not authenticated user then authentication failed", async () => {
    const result = await deleteTodo(
      crypto.getRandomValues(new Uint32Array(1))[0].toString(),
      crypto.getRandomValues(new Uint32Array(1))[0].toString(),
      crypto.getRandomValues(new Uint32Array(1))[0].toString()
    );
    expect(result).toBeTruthy();
  });

  test("data not found then failed", async () => {
    const userCredential = await signInAnonymously(authClient);
    const idToken = await getIdToken(userCredential.user);

    const result = await deleteTodo(
      idToken,
      userCredential.user.uid,
      crypto.getRandomValues(new Uint32Array(1))[0].toString()
    );
    expect(result).toBeTruthy();
  });

  test("another user then authentication failed", async () => {
    const userCredential = await signInAnonymously(authClient);
    const anotherUserCredential = await createUserWithEmailAndPassword(
      authClient,
      crypto.getRandomValues(new Uint32Array(1))[0].toString() + "@example.com",
      crypto.getRandomValues(new Uint32Array(1))[0].toString()
    );

    const idToken = await getIdToken(userCredential.user);

    const result = await deleteTodo(
      idToken,
      anotherUserCredential.user.uid,
      crypto.getRandomValues(new Uint32Array(1))[0].toString()
    );
    expect(result).toBeTruthy();
  });
});
