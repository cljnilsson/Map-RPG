import { db } from "$lib/server/db";
import { command } from "$app/server";
import { cityData, plot } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";

async function getOneCity(characterId: number, cityId: number) {
	return db
		.select()
		.from(cityData)
		.where(and(eq(cityData.characterId, characterId), eq(cityData.cityId, cityId)))
		.get();
}

async function cityDataExists(cityId: number, characterId: number): Promise<boolean> {
	const result = await getOneCity(characterId, cityId);

	return !!result;
}

function plotExists(cityId: number, plotId: string): boolean {
	const exists = db
		.select()
		.from(plot)
		.where(and(eq(plot.cityId, cityId), eq(plot.identifier, plotId)))
		.get();
	console.log(exists);
	return !!exists;
}

async function updatePlot(cityId: number, plotId: string, building: string): Promise<boolean> {
	const rows = await db
		.update(plot)
		.set({ building })
		.where(and(eq(plot.cityId, cityId), eq(plot.identifier, plotId)));

	return rows.changes > 0;
}

async function createPlot(cityId: number, plotId: string, building: string): Promise<boolean> {
	const rows = await db.insert(plot).values({ cityId, identifier: plotId, building });
	return rows.changes > 0;
}

const UpdatePlotPayloadSchema = v.object({
	building: v.pipe(v.string(), v.minLength(1)),
	plot: v.pipe(v.string(), v.minLength(1)),
	cityId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	characterId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
});

type UpdatePlotPayload = v.InferOutput<typeof UpdatePlotPayloadSchema>;

async function updateOnePlot({ building, plot, cityId, characterId }: UpdatePlotPayload): Promise<boolean> {
	// In theory should block requests if user is not logged in
	await getUser();

	const cityDataAlreadyExists = await cityDataExists(cityId, characterId);

	if (!cityDataAlreadyExists) {
		return false;
	}

	const plotAlreadyExists = plotExists(cityId, plot);

	if (!plotAlreadyExists) {
		return false;
	}

	if (plotExists(cityId, plot)) {
		console.log("Plot exists, updating");
		const success = await updatePlot(cityId, plot, building);
		return success;
	}

	console.log("Plot data does NOT exist, creating new");
	const success = await createPlot(cityId, plot, building);

	return success;
}

export const updateSpecificPlot = command(UpdatePlotPayloadSchema, updateOnePlot);