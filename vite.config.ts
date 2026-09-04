import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
    globals: true,

    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**",
      "**/playwright-report/**",
      "**/test-results/**",
    ],

    coverage: {
      thresholds: {
        lines: 80,
        functions: 75,
        statements: 80,
        branches: 70,
      },
    },
  },
});
