import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/terminal/**/__tests__/**/*.ts"],
    coverage: {
      provider: "v8",
      include: ["src/terminal/**"],
      exclude: ["src/terminal/**/__tests__/**"],
      thresholds: {
        lines: 90,
        functions: 90,
        statements: 90,
        branches: 85,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
