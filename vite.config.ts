import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import { svelteTesting } from "@testing-library/svelte/vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	clearScreen: false,
	css: {
		preprocessorOptions: {
			scss: {
				// Ensure Vite uses sass-embedded
				implementation: require("sass-embedded")
				// Optional: configure other sass options
				// sourceMap: true,
			}
		}
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest-setup.js"],
		include: ["src/**/*.{test,spec}.{js,ts}"],
		reporters: ["hanging-process"]
	},
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 1421
				}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ["**/src-tauri/**"]
		}
	}
});
