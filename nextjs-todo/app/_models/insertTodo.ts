"use server";

import { Todo } from "@/app/_models/Todo";
import { getFirestoreAdmin } from "@/app/_models/loadFirebaseAdmin";
import { isAuthorized } from "@/app/_models/isAuthorized";

export const insertTodo = async (idToken: string, uid: string, todo: Todo) => {
  if (!(await isAuthorized(idToken, uid))) {
    return;
  }

  const firestore = await getFirestoreAdmin();

  await firestore
    .collection("users")
    .doc(uid)
    .collection("todos")
    .add(todo)
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
};
