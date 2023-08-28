import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
});
