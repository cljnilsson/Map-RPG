import * as v from "valibot";
import { db } from "$lib/server/db";
import { flags } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { query } from "$app/server";

async function get(userId: number): Promise<{ name: string; value: number }[]> {
	const resp = await db
		.select({
			name: flags.name,
			value: flags.value
		})
		.from(flags)
		.where(eq(flags.userId, userId));

	return resp;
}

export const getFlags = query(v.number(), get);
