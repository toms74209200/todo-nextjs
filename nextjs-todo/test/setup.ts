export const setup = () => {
  if (process.env.ENV === "ci") {
    process.env.FIREBASE_DOMAIN = "localhost";
  } else {
    process.env.FIREBASE_DOMAIN = "firestore";
  }
};

export const teardown = () => {};
