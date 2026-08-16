import { defineConfig } from "@playwright/test";

export default defineConfig({
	webServer: {
		command: "npm run build && npm run preview",
		port: 4173,
		env: {
			BETTER_AUTH_SECRET: "playwright-test-secret-not-for-production"
		}
	},

	testDir: "e2e"
});
