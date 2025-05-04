import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { flags } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

function isValidInput(name: unknown, value: unknown): boolean {
	return typeof name === "string" && typeof value === "boolean";
}

async function getExistingFlag(userId: number, name: string) {
	return await db
		.select()
		.from(flags)
		.where(and(eq(flags.userId, userId), eq(flags.name, name)))
		.get();
}

async function updateFlag(flagId: number, value: boolean) {
	await db
		.update(flags)
		.set({ value: value ? 1 : 0 })
		.where(eq(flags.id, flagId));
}

async function insertFlag(userId: number, name: string, value: boolean) {
	await db.insert(flags).values({
		userId,
		name,
		value: value ? 1 : 0
	});
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { name, value } = await request.json();

	if (!isValidInput(name, value)) {
		return new Response("Invalid input", { status: 400 });
	}

	const userId = locals.user.id;

	const existing = await getExistingFlag(userId, name);

	if (existing) {
		await updateFlag(existing.id, value);
	} else {
		await insertFlag(userId, name, value);
	}

	return json({ success: true });
};