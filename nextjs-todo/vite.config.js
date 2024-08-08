import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: "**/*.{test,spec}.?(c|m)[jt]s?(x)",
    globalSetup: ["./test/setup.ts"],
    reporters: process.env.ENV ? ["verbose", "github-actions"] : ["verbose"],
  },
});
