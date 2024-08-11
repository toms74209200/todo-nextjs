"use server";

import { getFirestoreAdmin } from "@/app/_models/loadFirebaseAdmin";
import { Todo } from "@/app/_models/Todo";
import { isAuthorized } from "@/app/_models/isAuthorized";
import { TodoError } from "./TodoError";

export const updateTodo = async (
  idToken: string,
  uid: string,
  todo: Todo
): Promise<Error | null> => {
  if (!(await isAuthorized(idToken, uid))) {
    return { reason: "Unauthorized" } as TodoError;
  }

  const firestore = await getFirestoreAdmin();

  const selectResult = await firestore
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(todo.id!)
    .get();
  if (!selectResult.exists) {
    return { reason: "Not Found" } as TodoError;
  }

  const result = await firestore
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(todo.id!)
    .set(todo)
    .catch((error) => {
      return error;
    });

  if (result instanceof Error) {
    return result;
  }
  return null;
};
