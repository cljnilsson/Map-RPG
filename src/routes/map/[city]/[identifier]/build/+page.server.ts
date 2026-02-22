import { db } from "$lib/server/db";
import { flags } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

// TODO ensure the values are valid before loading

/*
async function ensureFlagExists(userId: number, flagName: string): Promise<void> {
	const existingFlag = await db
		.select()
		.from(flags)
		.where(and(eq(flags.userId, userId), eq(flags.name, flagName)))
		.get();

	if (!existingFlag) {
		await db.insert(flags).values({
			userId,
			name: flagName,
			value: 0
		});
	}
}

async function fetchUserFlags(userId: number): Promise<{ name: string; value: number }[]> {
	const resp = await db
		.select({
			name: flags.name,
			value: flags.value
		})
		.from(flags)
		.where(eq(flags.userId, userId));

	return resp;
}*/

export function load({ params }) {
	return {
		city: params.city,
		plot: params.identifier,
	};
}