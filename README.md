## Summery
A childhood browser game that I always enjoyed was Travian but due to its multiplayer nature it is incredibly time demanding to play in any serious capacity as the management scales exponentially. As such I think there is room to have the spirit of Travian in a single player format. So far it is sort of a tech demo of some potential RPG aspects which will slowly be integrated together.

## Key Features
* An interactive world/city map
* Time based upgrades / decisions, vaguely similar to an idle game
* DnD-like character stats and story + dice

## Key Tech (so far)
* Sveltekit (Svelte 5 with Typescript)
* Bootstrap
* bunjs runtime (only soft required, I think)
* Drizzle
  * Even though it's singleplayer, some persistent storage makes sense. I might convince myself to do it in json for the sake of a lighter tech stack but this is the goal for now.
* Lucia
  * Easily confused with an open standard of best practices, the current login implementation is safe if a bit verbose and should probably be switched out at some point - likely with lucia-auth.

## Developing
Install dependencies with `bun install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
bun run dev```

## Building

To create a production version of your app:

```bash
bun run build
```

You also need to run the seed.ts file to populate certain DB fields.

You can preview the production build with `bun run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Structure notes
* Controller
  * The heart of the logic, offering an abstract API that internally talks with a lot of other parts of the application.
* Component / Features
  * Might change this but the idea is that Window is a reusable component while InventoryWindow is not and these should go in seperate folders.
* Partials
  * low logic or no logic files that are mainly there for abstraction
* Game
  * Might be moved into features later but for now this is where the game logic might be placed.
* Stores
  * Responsible for clientside data, exclusively svelte.ts files
* Utils
  * Handy helpers, exclusively .ts files

## New stuff, personal notes
drizzle: 
  - You will need to set DATABASE_URL in your production environment  
  - Run bun run db:push to update your database schema  
  - npx drizzle-kit push
  - bun tauri dev
  
## Art Credit
More detailed credits will be added once I know which pieces are final but generally speaking:
- Pinterest for character art
- ChatGPT AI generated for character art, NPCs and icons
- hiveworkshop for item icons
- Goblinounours for modified Blizzard icons