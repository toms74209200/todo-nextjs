"use server";

import { Todo } from "@/app/_models/Todo";
import { getFirestoreAdmin } from "@/app/_models/getFirestoreAdmin";

export const insertTodo = async (todo: Todo) => {
  const firestore = await getFirestoreAdmin();

  await firestore
    .collection("todos")
    .add(todo)
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
};
