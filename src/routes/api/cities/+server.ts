import { json } from "@sveltejs/kit";
import type { RequestHandler } from '@sveltejs/kit';
import { db } from "$lib/server/db";
//import { city, cityData } from "$lib/server/db/schema";
//import { eq } from "drizzle-orm";

async function getCities() {
	return await db.query.cityData.findMany({
		with: {
			resources: {
				with: {
					resource: true
				}
			},
			units: {
				with: {
					unit: true
				}
			},
			city: true
		}
	});
}

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const existing = await getCities()

	const cities = existing.map(({ city, units, ...rest }) => ({
		...rest,
		name: city.name,
		units: units.map(({ unit, ...unitRest }) => ({
			...unitRest,
			name: unit.name,
			iconPath: unit.iconPath
		}))
	}));

	return json({ success: true, cities: cities });
};