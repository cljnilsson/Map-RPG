import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [
    sveltekit({
      // Consult https://svelte.dev/docs/kit/integrations
      // for more information about preprocessors
      inspector: true,
      preprocess: vitePreprocess(),
      compilerOptions: { experimental: { async: true } },
      experimental: { remoteFunctions: true },
      // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
      // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
      // See https://svelte.dev/docs/kit/adapters for more information about adapters.
      adapter: adapter(),
      alias: { $routes: "src/routes" },
    }),

  ],
  clearScreen: false,
  resolve: {
    alias: { $routes: "/src/routes" },
    ...(process.env.VITEST ? { conditions: ["browser"] } : {}),
  },
  optimizeDeps: {
    exclude: ["@fortawesome/svelte-fontawesome"],
  },
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
});
