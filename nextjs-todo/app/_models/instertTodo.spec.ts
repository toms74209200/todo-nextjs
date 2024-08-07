import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";
import { insertTodo } from "./insertTodo";
import { getFirestoreAdmin } from "./loadFirebaseAdmin";
import { getFirebaseAuth } from "./loadFirebase";
import { getIdToken, signInAnonymously } from "firebase/auth";
import { Firestore } from "firebase-admin/firestore";

const authClient = getFirebaseAuth();
let firestoreAdmin: Firestore;

describe("Test for insertTodo", () => {
  beforeAll(async () => {
    firestoreAdmin = await getFirestoreAdmin();
  });

  afterAll(async () => {
    await fetch(
      `http://firestore:8080/emulator/v1/projects/nextjs-todo/databases/(default)/documents`,
      { method: "DELETE" }
    );
  });

  test("success", async () => {
    const userCredential = await signInAnonymously(authClient);
    const idToken = await getIdToken(userCredential.user);

    const expected = {
      title: "test",
      completed: false,
    };

    const result = await insertTodo(idToken, userCredential.user.uid, expected);

    expect(result).toBeNull();

    const snapshot = await firestoreAdmin
      .collection("users")
      .doc(userCredential.user.uid)
      .collection("todos")
      .get();
    const todos = snapshot.docs.map((doc) => doc.data());
    expect(todos).toEqual([expected]);
  });
});
