# Map-RPG contributor guide

## Project

Map-RPG is a single-player, Travian-inspired RPG/management game built with SvelteKit, Svelte 5, TypeScript, Bootstrap, Drizzle ORM (SQLite), and better-auth. Prefer small, focused changes that fit the existing feature structure; much of the game is still prototypical.

## Commands

```bash
npm run dev                 # start the SvelteKit dev server
npm run check               # Svelte + TypeScript diagnostics
npm test                    # run the Vitest suite once
npm test -- --run path/to/spec.ts  # run one spec file
npm run build               # production build
npm run db:push             # apply Drizzle schema changes
npm run db:migrate          # run migrations
npm run db:studio           # open Drizzle Studio
npx tsx ./seed.ts           # seed the first account with demo data
```

`DATABASE_URL` is required for database commands and any server code that imports `src/lib/server/db/index.ts`. Do not run schema-changing or seed commands unless the task calls for them.

## Source layout

- `src/routes/`: SvelteKit pages and route-specific server load/actions.
- `src/lib/features/`: feature-specific UI and gameplay modules.
- `src/lib/components/`: reusable, general-purpose UI components.
- `src/lib/controller/`: higher-level game logic and APIs used by the UI.
- `src/lib/stores/`: client-side reactive state; these intentionally use the `.svelte.ts` extension.
- `src/lib/data/`: static game data and definitions.
- `src/lib/types/`: shared TypeScript types.
- `src/lib/api/`: server-side remote/data operations.
- `src/lib/server/db/schema/`: Drizzle schema definitions; export schema additions through `index.ts`.
- `src/tests/`: Vitest unit tests. Component and controller tests have subdirectories.
- `static/`: public assets, addressed from the app with root-relative paths such as `/characters/male1.png`.

## Svelte and TypeScript conventions

- Use Svelte 5 runes in components and reactive `.svelte.ts` modules (`$state`, `$derived`, `$effect`). Follow nearby code when extending an existing component.
- Keep browser-only state and UI logic out of server modules. Put server/database code behind `src/lib/server`, `+page.server.ts`, or the existing API layer.
- Use `$lib/...` imports for code under `src/lib` and `import type` when importing types only.
- Model game rules as plain, testable TypeScript functions where practical. Keep UI components focused on input, display, and calling those rules.
- Do not silently mutate unrelated global stores or controller state. Persist gameplay changes through the relevant controller/API path.

## Data, auth, and database safety

- The database is SQLite via Drizzle and `better-sqlite3`; the database module throws if `DATABASE_URL` is absent.
- When changing a schema, update the schema files and run the appropriate Drizzle workflow only when authorised. Never hand-edit a live database file.
- Preserve the existing better-auth integration in `src/lib/auth.ts`, `src/lib/auth-client.ts`, and `src/hooks.server.ts`. Treat auth and user-owned data as sensitive.

## Quality checks

- Add or update focused Vitest coverage for new gameplay logic, controllers, and regressions. Keep tests deterministic; inject or mock randomness and external APIs.
- Run `npm run check` after Svelte/TypeScript changes and the relevant test file(s) after logic changes. Run the full suite when the change has broad impact.
- Formatting is managed by Biome: tabs, double quotes in JS/TS, and a 175-character line width. Do not perform unrelated formatting churn.
- Existing warnings or failures outside the files you changed should be reported, not casually fixed as part of an unrelated task.

## Change discipline

- Inspect `git status` before editing. Preserve unrelated work already in the tree.
- Strongly avoid adding dependencies unless they are necessary and explicitly justified.
- Avoid generated artifacts, build output, and secrets in commits.
- For visible UI work, maintain keyboard accessibility and use semantic controls (`button`, `label`, `input`, `select`) where appropriate.
