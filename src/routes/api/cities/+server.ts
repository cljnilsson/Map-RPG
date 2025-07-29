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
			city: true
		}
	});
}

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const existing = await getCities()

	const cities = existing.map(({ city, ...rest }) => ({
		...rest,
		name: city.name
	}));

	return json({ success: true, cities: cities });
};