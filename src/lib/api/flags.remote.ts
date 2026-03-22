import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { flags } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";

function getExistingFlag(userId: string, name: string) {
	return db
		.select()
		.from(flags)
		.where(and(eq(flags.userId, userId), eq(flags.name, name)))
		.get();
}

async function updateFlag(flagId: number, value: boolean): Promise<boolean> {
	const rows = await db
		.update(flags)
		.set({ value: value ? 1 : 0 })
		.where(eq(flags.id, flagId));

	return rows.changes > 0;
}

async function insertFlag(userId: string, name: string, value: boolean): Promise<boolean> {
	const rows = await db.insert(flags).values({
		userId,
		name,
		value: value ? 1 : 0,
	});

	return rows.changes > 0;
}

async function fetchUserFlags(userId: string): Promise<{ name: string; value: number }[]> {
	const resp = await db
		.select({
			name: flags.name,
			value: flags.value,
		})
		.from(flags)
		.where(eq(flags.userId, userId));

	return resp;
}

const UpdateFlagSchema = v.object({
	name: v.string(),
	value: v.boolean(),
});

type UpdateFlagData = v.InferOutput<typeof UpdateFlagSchema>;

async function post({ name, value }: UpdateFlagData) {
	// In theory should block requests if user is not logged in
	const user = await getUser();

	const userId = user.id;

	const existing = getExistingFlag(userId, name);

	if (existing) {
		await updateFlag(existing.id, value);
	} else {
		await insertFlag(userId, name, value);
	}

	return true;
}

async function get() {
	// In theory should block requests if user is not logged in
	const user = await getUser();

	const userId = user.id;

	const existing = await fetchUserFlags(userId);

	return { success: true, flags: existing };
}

export const getFlags = query(get);
export const updateOneFlag = command(UpdateFlagSchema, post);