"use server";

import { Todo } from "@/app/_models/Todo";
import { getFirestoreAdmin } from "@/app/_models/loadFirebaseAdmin";
import { isAuthorized } from "@/app/_models/isAuthorized";
import { TodoError } from "./TodoError";

export const insertTodo = async (
  idToken: string,
  uid: string,
  todo: Todo
): Promise<Error | null> => {
  if (!(await isAuthorized(idToken, uid))) {
    return { reason: "Unauthorized" } as TodoError;
  }

  const firestore = await getFirestoreAdmin();

  const result = await firestore
    .collection("users")
    .doc(uid)
    .collection("todos")
    .add(todo)
    .catch((error) => {
      return error;
    });
  if (result instanceof Error) {
    return result;
  }
  return null;
};
