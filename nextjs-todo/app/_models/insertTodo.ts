"use server";

import { Todo } from "@/app/_models/Todo";
import { getFirestoreAdmin } from "@/app/_models/getFirestoreAdmin";

export const insertTodo = async (uid: string, todo: Todo) => {
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
