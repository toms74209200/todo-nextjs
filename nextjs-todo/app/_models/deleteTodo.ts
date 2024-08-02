"use server";

import { getFirestoreAdmin } from "@/app/_models/loadFirebaseAdmin";
import { isAuthorized } from "@/app/_models/isAuthorized";

export const deleteTodo = async (idToken: string, uid: string, id: string) => {
  if (!(await isAuthorized(idToken, uid))) {
    return;
  }

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
