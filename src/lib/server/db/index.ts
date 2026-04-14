import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
// the below works in dev environment and saves one dependency but leave it for the end if I want to optimize
//import { drizzle } from "drizzle-orm/bun-sqlite";
//import { Database } from "bun:sqlite";
import { env } from "$env/dynamic/private";
import * as schema from "$lib/server/db/schema";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const client = new Database(env.DATABASE_URL);
const db = drizzle(client, { schema });

export { db };