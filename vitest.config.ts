import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";

export default defineConfig({
  plugins: [sveltekit(), svelteTesting()],
  test: {
    environment: "jsdom",
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
