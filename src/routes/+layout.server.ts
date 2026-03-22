import type { LayoutServerLoad } from "./$types";
import { db } from "$lib/server/db"; // adjust path as needed
import { flags } from "$lib/server/db/schema"; // adjust path as needed
import { eq, and } from "drizzle-orm";
import type { LayoutData } from "$lib/types/layoutData";
import { auth } from "$lib/auth";
import { getFlags } from "$lib/api/flags.remote";

async function ensureFlagExists(userId: string, flagName: string): Promise<void> {
	const existingFlag = db
		.select()
		.from(flags)
		.where(and(eq(flags.userId, userId), eq(flags.name, flagName)))
		.get();

	if (!existingFlag) {
		await db.insert(flags).values({
			userId,
			name: flagName,
			value: 0,
		});
	}
}

export const load: LayoutServerLoad = async ({ request }): Promise<LayoutData> => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session || !session?.user) {
		return { userFlags: [] };
	}

	const userId = session.user.id;
	const tutorialFlagName = "tutorialCompleted";

	await ensureFlagExists(userId, tutorialFlagName);

	const userFlags = (await getFlags()).flags;

	return {
		userFlags,
	};
};