"use server";

import { getFirestoreAdmin } from "@/app/_models/getFirestoreAdmin";
import { Todo } from "@/app/_models/Todo";

export const selectTodo = async () => {
  const firestore = await getFirestoreAdmin();

  const snapshot = await firestore.collection("todos").get();
  const todos: Todo[] = snapshot.docs
    .map((doc) => doc.data())
    .map((data) => {
      return {
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        completed: data.completed,
      };
    });

  return todos;
};
