"use server";

import { getFirestoreAdmin } from "@/app/_models/getFirestoreAdmin";
import { Todo } from "@/app/_models/Todo";

export const selectTodo = async () => {
  const firestore = await getFirestoreAdmin();

  const snapshot = await firestore.collection("todos").get();
  const todos: Todo[] = snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      title: doc.data().title,
      description: doc.data().description,
      deadline: doc.data().deadline,
      completed: doc.data().completed,
    };
  });

  return todos;
};
