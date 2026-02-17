import type { RequestHandler } from "./$types";
import { produce } from "sveltekit-sse";
import { resources } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "$lib/server/db";
import dayjs from "dayjs";

const intervalSeconds = 60;

async function runTask() {
	console.log("Running server task at", dayjs().format("YYYY-MM-DD HH:mm:ss"));

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

type Client = {
	emit: (event: "message", payload: string) => { error?: unknown };
};

const connections: Set<Client> = new Set();
let loopRunning = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function resourceLoop() {
	if (loopRunning) return;
	loopRunning = true;

	while (connections.size > 0) {
		await runTask();
		const newResources = await getResources();
		const payload: ServerPing = { timestamp: Date.now(), data: newResources };

		for (const client of [...connections]) {
			const { error } = client.emit("message", JSON.stringify(payload));
			if (error) connections.delete(client);
		}

		console.log("Active connections:", connections.size);
		await delay(1000 * intervalSeconds);
	}

	loopRunning = false;
}

export const POST: RequestHandler = async () => {
	return produce(
		async ({ emit }) => {
			const client = { emit };
			connections.add(client);

			if (!loopRunning) resourceLoop();

			// cleanup when this client disconnects
			return () => {
				connections.delete(client);
				console.log("Client disconnected, total:", connections.size);
			};
		},
		{ ping: 10 },
	);
};

export function _getConnections() {
	return connections;
}