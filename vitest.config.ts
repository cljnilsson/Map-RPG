import { defineConfig } from "vitest/config";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

export default defineConfig({
  plugins: [svelte({ preprocess: vitePreprocess() }), svelteTesting()],
  resolve: {
    alias: {
      "$app/env": new URL("./src/tests/mocks/sveltekit-env.ts", import.meta.url).pathname,
      "$app/environment": new URL("./src/tests/mocks/sveltekit-env.ts", import.meta.url).pathname,
      "$app/paths": new URL("./src/tests/mocks/sveltekit-paths.ts", import.meta.url).pathname,
    },
  },
  test: {
    environment: "happy-dom",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    setupFiles: ["./vitest-setup.js"],
    tags: [
      {
        name: "db",
        description: "Tests for database queries.",
        timeout: 60_000,
      },
      {
        name: "flaky",
        description: "Flaky CI tests.",
        retry: process.env.CI ? 3 : 0,
      },
    ],
  },
});
