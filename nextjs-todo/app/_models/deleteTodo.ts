"use server";

import { getFirestoreAdmin } from "@/app/_models/loadFirebaseAdmin";

export const deleteTodo = async (uid: string, id: string) => {
  const firestore = await getFirestoreAdmin();

  await firestore
    .collection("users")
    .doc(uid)
    .collection("todos")
    .doc(id)
    .delete()
    .catch((error) => {
      console.error("Error deleting document: ", error);
    });
};
