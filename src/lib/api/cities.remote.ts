import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { cityData } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";
import type { CityResource } from "$lib/types/resource";

async function getAllCities() {
	return await db.query.cityData.findMany({
		with: {
			resources: {
				with: {
					resource: true,
				},
			},
			units: {
				with: {
					unit: true,
				},
			},
			city: true,
			plots: true,
			storage: true,
		},
	});
}

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

const UpdateCityDataSchema = v.object({
	cityId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	characterId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	population: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	workers: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
});

type UpdateCityData = v.InferOutput<typeof UpdateCityDataSchema>;

async function updateOneCityData({ cityId, characterId, population, workers }: UpdateCityData): Promise<boolean> {
	const exists = await cityDataExists(cityId, characterId);

	if (!exists) {
		return false;
	}

	const rows = await db
		.update(cityData)
		.set({ population, workers })
		.where(and(eq(cityData.characterId, characterId), eq(cityData.cityId, cityId)))
		.returning({ id: cityData.id });

	return rows.length > 0;
}

type ReturnCityDataEager = {
	name: string;
	units: {
		name: string;
		iconPath: string;
		id: number;
		value: number;
		cityId: number;
		unitId: number;
	}[];
	resources: CityResource[];
	id: number;
	characterId: number;
	cityId: number;
	population: number;
	workers: number;
	plots: {
		id: number;
		identifier: string;
		level: number;
		cityId: number;
		building: string | null;
	}[];
	storage: {
		id: number;
		itemKey: string;
		amount: number;
		cityId: number;
	}[];
};

async function get(): Promise<ReturnCityDataEager[]> {
	// In theory should block requests if user is not logged in
	await getUser();

	const existing = await getAllCities();

	const cities = existing.map(({ city, units, resources, ...rest }) => ({
		...rest,
		name: city.name,
		units: units.map(({ unit, ...unitRest }) => ({
			...unitRest,
			name: unit.name,
			iconPath: unit.iconPath,
		})),
		resources: resources.map(({ resource, value, ...resourceRest }) => ({
			...resourceRest,
			name: resource.name,
			iconPath: resource.iconPath,
			baseLimit: resource.baseLimit,
			amount: value,
		})),
	}));

	return cities;
}

export const getCities = query(get);
export const updateCityData = command(UpdateCityDataSchema, updateOneCityData);