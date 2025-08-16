import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import fs from "fs";
import * as schema from "$lib/server/db/schema";
import { SQLiteTable } from "drizzle-orm/sqlite-core";

export default async function dumpDatabaseToJSON(dbPath: string, outputPath: string) {
	const sqlite = new Database(dbPath);
	const db = drizzle(sqlite, { schema });

	const dump: Record<string, unknown[]> = {};

	for (const [tableName, table] of Object.entries(schema)) {
		// Only process actual tables
		if (table instanceof SQLiteTable) {
			const rows = await db.select().from(table);
			dump[tableName] = rows;
		}
	}

	fs.writeFileSync(outputPath, JSON.stringify(dump, null, 2));
	console.log(`Dumped DB to ${outputPath}`);
}

// Example
//dumpDatabaseToJSON("mydb.sqlite", "offline-dump.json");