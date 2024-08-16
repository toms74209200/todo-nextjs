import { updateTodo } from "./updateTodo";
import { getFirestoreAdmin } from "./loadFirebaseAdmin";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { Firestore } from "firebase-admin/firestore";
import { FIREBSE_DOMAIN, getFirebaseAuth } from "./loadFirebase";
import {
  createUserWithEmailAndPassword,
  getIdToken,
  signInAnonymously,
} from "firebase/auth";

const authClient = getFirebaseAuth();
let firestoreAdmin: Firestore;

describe("Test for updateTodo", { retry: 10 }, () => {
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
        title: "test",
        completed: false,
      });

    const idToken = await getIdToken(userCredential.user);

    const expected = {
      id: docRef.id,
      title: "test",
      completed: true,
    };

    const result = await updateTodo(idToken, userCredential.user.uid, expected);

    expect(result).toBeNull();

    const snapshot = await firestoreAdmin
      .collection("users")
      .doc(userCredential.user.uid)
      .collection("todos")
      .doc(docRef.id)
      .get();
    const todos = snapshot.data();
    expect(todos).toEqual(expected);
  });

  test("data not found then failed", async () => {
    const userCredential = await signInAnonymously(authClient);
    const idToken = await getIdToken(userCredential.user);

    const expected = {
      id: "invalid",
      title: "test",
      completed: true,
    };

    const result = await updateTodo(idToken, userCredential.user.uid, expected);

    expect(result).toBeTruthy();
  });

  test("not authenticated user then authentication failed", async () => {
    const result = await updateTodo("invalid", "invalid", {
      id: "invalid",
      title: "test",
      completed: false,
    });

    expect(result).toBeTruthy();
  });

  test("another user then authentication failed", async () => {
    const userCredential = await signInAnonymously(authClient);
    const anotherUserCredential = await createUserWithEmailAndPassword(
      authClient,
      crypto.getRandomValues(new Uint32Array(1))[0].toString() + "@example.com",
      "password"
    );

    const idToken = await getIdToken(userCredential.user);

    const expected = {
      id: "invalid",
      title: "test",
      completed: false,
    };

    const result = await updateTodo(
      idToken,
      anotherUserCredential.user.uid,
      expected
    );

    expect(result).toBeTruthy();
  });
});
