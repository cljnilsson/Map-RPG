import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { cityData, plot } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

type UpdatePlotPayload = {
	building: string,
	plot: string,
	city: string
};

async function updatePlot(cityId: number, plotId: string, building: string): Promise<boolean> {
	await db
		.update(plot)
		.set({ building })
		.where(and(eq(plot.cityId, cityId), eq(plot.identifier, plotId)));

	return true;
}

async function createPlot(cityId: number, plotId: string, building: string) {
	await db.insert(plot).values({ cityId, identifier: plotId, building });
}

async function plotExists(cityId: number, plotId: string): Promise<boolean> {
	const exists = await db
		.select()
		.from(plot)
		.where(and(eq(plot.cityId, cityId), eq(plot.identifier, plotId)))
		.get();
	console.log(exists);
	return !!exists;
}

/*
async function getCityDataByNameAndCharacter(cityName: string, characterId: number): Promise<boolean> {
	const exists = await db
		.select()
		.from(cityData)
		.where(and(eq(cityData.), eq(plot.identifier, plotId)))
		.get();
	console.log(exists);
	return !!exists;
}*/

function isUpdateCharacterPayload(data: any): data is UpdatePlotPayload {
	if (
		typeof data !== "object" ||
		data === null ||
		typeof data.building !== "string" ||
		typeof data.plot !== "string" ||
		typeof data.city !== "string"
	) {
		return false;
	}
	return true;
}

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const body = await request.json();

	if (!isUpdateCharacterPayload(body)) {
		return new Response("Invalid input", { status: 400 });
	}

	const { building, city, plot } = body;
	const hardCodedDevTestId = 1; // either grab by name + character or send from character

	if (await plotExists(hardCodedDevTestId, plot)) {
		console.log("Plot exists, updating");
		const success = await updatePlot(hardCodedDevTestId, plot, building);
		return json({ success });
	}

	console.log("Plot data does NOT exist, creating new");
	await createPlot(hardCodedDevTestId, plot, building);
	return json({ success: true });
};
