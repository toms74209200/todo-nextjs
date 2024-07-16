"use server";

import { getFirestoreAdmin } from "@/app/_models/getFirestoreAdmin";

export const deleteTodo = async (id: string) => {
  const firestore = await getFirestoreAdmin();

  await firestore
    .collection("todos")
    .doc(id)
    .delete()
    .catch((error) => {
      console.error("Error deleting document: ", error);
    });
};
