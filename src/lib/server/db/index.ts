import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { env } from "$env/dynamic/private";
import * as schema from "$lib/server/db/schema";

//let db;
/*
if (process.env.NODE_ENV === "test") {
	console.log(">>> Using drizzle.mock()");
	db = drizzle.mock({ schema });
} else {
	console.log(">>> Using real better-sqlite3");
	if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
	const client = new Database(env.DATABASE_URL);
	db = drizzle(client, { schema });
}*/

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const client = new Database(env.DATABASE_URL);
const db = drizzle(client, { schema });

export { db };
