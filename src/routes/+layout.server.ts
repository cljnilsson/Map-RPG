import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db"; // adjust path as needed
import { flags } from "$lib/server/db/schema"; // adjust path as needed
import { eq, and } from "drizzle-orm";

async function ensureFlagExists(userId: string, flagName: string): Promise<void> {
	const existingFlag = await db
		.select()
		.from(flags)
		.where(and(eq(flags.userId, userId), eq(flags.name, flagName)))
		.get();

	if (!existingFlag) {
		await db.insert(flags).values({
			id: crypto.randomUUID(),
			userId,
			name: flagName,
			value: 0
		});
	}
}

async function fetchUserFlags(userId: string): Promise<{ name: string; value: number }[]> {
	return await db
		.select({
			name: flags.name,
			value: flags.value
		})
		.from(flags)
		.where(eq(flags.userId, userId));
}

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return { user: null, userFlags: [] };
	}

	const userId = locals.user.id;
	const tutorialFlagName = "tutorialCompleted";

	await ensureFlagExists(userId, tutorialFlagName);

	const userFlags = await fetchUserFlags(userId);

	return {
		user: locals.user,
		userFlags
	};
};

