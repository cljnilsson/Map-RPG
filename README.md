## Developing

Once you've created a project and installed dependencies with `bun install`, start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
bun run dev```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## New stuff
drizzle: 
  - You will need to set DATABASE_URL in your production environment  
  - Run bun run db:push to update your database schema  
                                                
  lucia:  
  - Run bun run db:push to update your database schema              
  - Visit /demo/lucia route to view the demo