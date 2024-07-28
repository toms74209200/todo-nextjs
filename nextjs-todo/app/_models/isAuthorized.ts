import { getAuthAdmin } from "./loadFirebaseAdmin";

export const isAuthorized = async (
  idToken: string,
  uid: string
): Promise<boolean> => {
  const auth = await getAuthAdmin();
  const decodedIdToken = await auth.verifyIdToken(idToken).catch(() => {
    return null;
  });

  if (decodedIdToken === null) {
    return false;
  }

  return decodedIdToken.uid === uid;
};
