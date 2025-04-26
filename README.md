## Summery
A childhood browser game that I always enjoyed was Travian but due to its multiplayer nature it is incredibly time demanding to play in any serious capacity as the management scales exponentially. As such I think there is room to have the spirit of Travian in a single player format. So far it is sort of a tech demo of some potential RPG aspects which will slowly be integrated together.

## Key Features
* An interactive world/city map
* Time based upgrades / decisions, vaguely similar to an idle game
* DnD-like character stats and story + dice

## Developing
Once you've created a project and installed dependencies with `bun install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
bun run dev```

## Building

To create a production version of your app:

```bash
bun run build
```

You can preview the production build with `bun run preview`.
s
> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## New stuff, personal notes
drizzle: 
  - You will need to set DATABASE_URL in your production environment  
  - Run bun run db:push to update your database schema  
                                                
  lucia:  
  - Run bun run db:push to update your database schema              
  - Visit /demo/lucia route to view the demo