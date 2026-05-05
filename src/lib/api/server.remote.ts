import { query } from "$app/server";
import { resources } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "$lib/server/db";
import dayjs from "dayjs";

const intervalSeconds = 60;

async function getResources() {
	const existing = await db.query.resources.findMany({
		with: {
			resource: true,
			city: {
				with: {
					city: true,
				},
			},
		},
	});

	return existing.map(({ city, resource, resourceId, id, ...rest }) => ({
		...rest,
		name: city.city.name,
		resource: resource.name,
	}));
}

type ServerPing = {
	timestamp: number;
	data: ReturnType<typeof getResources> extends Promise<infer R> ? R : unknown;
};

async function runTask() {
	console.log("(new) Running server task at", dayjs().format("YYYY-MM-DD HH:mm:ss"), "with interval", intervalSeconds, "seconds");

	const limit = 200;
	//const production = 1; old harcoded remove once reading from db is proven stable.

	const cities = await db.query.cityData.findMany({
		with: { resources: { with: { resource: true } }, city: true },
	});

	for (const city of cities) {
		for (const res of city.resources) {
			if (res.value < limit) {
				await db
					.update(resources)
					.set({ value: res.value + res.production })
					.where(and(eq(resources.cityId, city.city.id), eq(resources.resourceId, res.resource.id)));
			}
		}
	}
}

// Basic demo based on Rich Harris PR
const sleep = (ms: number) => new Promise((f) => setTimeout(f, ms));

export const now = query.live(async function* () {
	while (true) {
		await runTask();
		const newResources = await getResources();
		const payload: ServerPing = { timestamp: Date.now(), data: newResources };
		yield payload;
		await sleep(1000 * intervalSeconds);
	}
});