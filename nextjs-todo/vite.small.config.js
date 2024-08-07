import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: "**/*.small.{test,spec}.?(c|m)[jt]s?(x)",
    env: {
      FIREBASE_DOMAIN: "firestore",
    },
  },
});
