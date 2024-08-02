"use server";

import { getFirestoreAdmin } from "@/app/_models/loadFirebaseAdmin";
import { Todo } from "@/app/_models/Todo";
import { isAuthorized } from "@/app/_models/isAuthorized";

export const updateTodo = async (idToken: string, uid: string, todo: Todo) => {
  if (!(await isAuthorized(idToken, uid))) {
    return;
  }

  const firestore = await getFirestoreAdmin();

  await firestore
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(todo.id!)
    .set(todo)
    .catch((error) => {
      console.error("Error updating document: ", error);
    });
};
