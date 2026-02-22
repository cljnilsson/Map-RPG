import { json } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { auth } from "$lib/auth";
//import { city, cityData } from "$lib/server/db/schema";
//import { eq } from "drizzle-orm";

async function getCities() {
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

export const GET: RequestHandler = async ({ request }) => {
	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session || !session?.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const existing = await getCities();

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

	return json({ success: true, cities: cities });
};