"use server";

import { getFirestoreAdmin } from "@/app/_models/getFirestoreAdmin";
import { Todo } from "@/app/_models/Todo";

export const updateTodo = async (uid: string, todo: Todo) => {
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
