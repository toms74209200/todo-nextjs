"use server";

import { getFirestoreAdmin } from "@/app/_models/loadFirebaseAdmin";
import { isAuthorized } from "@/app/_models/isAuthorized";
import { TodoError } from "./TodoError";

export const deleteTodo = async (
  idToken: string,
  uid: string,
  id: string
): Promise<Error | null> => {
  if (!(await isAuthorized(idToken, uid))) {
    return { reason: "Unauthorized" } as TodoError;
  }

  const firestore = await getFirestoreAdmin();

  const result = await firestore
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(id)
    .delete()
    .catch((error) => {
      return error;
    });

  if (result instanceof Error) {
    return result;
  }
  return null;
};
