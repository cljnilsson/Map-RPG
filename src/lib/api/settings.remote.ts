import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { settings, type Settings } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";

async function getAllSettings() {
	return await db.query.settings.findMany();
}

async function getSetting(userId: number) {
	return await db.query.settings.findFirst({
		where: (setting, { eq }) => eq(setting.userId, userId)
	});
}

/*async function getResourceByName(name: string) {
	return await db.select().from(resource).where(eq(resource.name, name)).get();
}*/

async function updateSettingsForUser(
	userId: number,
	darkMode: boolean,
	offlineMode: boolean,
	keybindTooltips: boolean,
	keybinds: Record<string, string>
): Promise<boolean> {
	const rows = await db.update(settings).set({ darkMode, offlineMode, keybindTooltips, keybinds }).where(eq(settings.userId, userId));

	return rows.changes > 0;
}

async function createSettings(userId: number) {
	const rows = await db.insert(settings).values([
		{
			userId,
			darkMode: false,
			offlineMode: false,
			keybindTooltips: false,
			keybinds: {}
		}
	]);

	return rows.changes > 0;
}

async function get(): Promise<Settings[]> {
	const existing = await getAllSettings();

	return existing;
}

// Could use omit on the other but don't want the dependency
const UserIdSchema = v.object({
	userId: v.pipe(v.number(), v.integer(), v.toMinValue(0))
});

type UserIdData = v.InferOutput<typeof UserIdSchema>;

async function getOneSetting({ userId }: UserIdData): Promise<Settings | undefined> {
	const existing = await getSetting(userId);

	return existing;
}

const SettingsSchema = v.object({
	userId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	darkMode: v.boolean(),
	offlineMode: v.boolean(),
	keybindTooltips: v.boolean(),
	keybinds: v.record(v.string(), v.string())
});

type SettingData = v.InferOutput<typeof SettingsSchema>;

async function createPost(body: SettingData) {
	console.log(body);
	let failed: SettingData | false = false;

	/*const resource = await getResourceByName(body.resourceName);
	console.log(resource);
	if (!resource) {
		return { success: false, failed };
	}*/

	const success = await createSettings(body.userId);
	console.log(success);
	if (!success) {
		failed = body;
	}

	if (failed) {
		return { success: false, failed };
	}

	return { success: true };
}

async function updatePost(body: SettingData) {
	console.log(body);
	let failed: SettingData | false = false;

	// Clean up returns later
	const resource = await getSetting(body.userId);
	if (!resource) {
		return { success: false, failed };
	}

	const success = updateSettingsForUser(body.userId, body.darkMode, body.offlineMode, body.keybindTooltips, body.keybinds);
	if (!success) {
		failed = body;
	}

	if (failed) {
		return { success: false, failed };
	}

	return { success: true };
}

export const createSetting = command(SettingsSchema, createPost);
export const updateSetting = command(SettingsSchema, updatePost);
export const getSettingForUser = command(UserIdSchema, getOneSetting);
export const getSettings = query(get);
