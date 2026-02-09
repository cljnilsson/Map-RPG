import { inArray, sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import { resource, unit } from "$lib/server/db/schema";

let hasRun = false;

async function checkTablesExist() {
	const REQUIRED_TABLES = ["resource", "unit"];

	const rows = db.all<{ name: string }>(sql`
    SELECT name
    FROM sqlite_master
    WHERE type = 'table'
  `);

	const existing = new Set(rows.map((r) => r.name));
	const missing = REQUIRED_TABLES.filter((t) => !existing.has(t));

	if (missing.length > 0) {
		throw new Error(`[db] missing required tables: ${missing.join(", ")}`);
	}
}

const REQUIRED_RESOURCES = ["Wood", "Gold", "Iron", "Stone", "Silk", "Wheat"] as const;

async function checkResources() {
	const rows = await db.select({ name: resource.name }).from(resource).where(inArray(resource.name, REQUIRED_RESOURCES));

	const found = new Set(rows.map((r) => r.name));
	const missing = REQUIRED_RESOURCES.filter((r) => !found.has(r));

	if (missing.length > 0) {
		throw new Error(`[db] missing resources: ${missing.join(", ")}`);
	}
}

const REQUIRED_UNITS = ["Merchant", "Soldier", "Smith", "Priest"] as const;

async function checkUnits() {
	const rows = await db.select({ name: unit.name }).from(unit).where(inArray(unit.name, REQUIRED_UNITS));

	const found = new Set(rows.map((r) => r.name));
	const missing = REQUIRED_UNITS.filter((u) => !found.has(u));

	if (missing.length > 0) {
		throw new Error(`[db] missing units: ${missing.join(", ")}`);
	}
}

export async function dbCheckup() {
	if (hasRun) return;
	hasRun = true;

	console.log("[db] running health check");

	await checkTablesExist();
	await checkResources();
	await checkUnits();

	console.log("[db] health check OK");
}
