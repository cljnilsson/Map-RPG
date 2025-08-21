import { db } from "$lib/server/db";
import { query } from "$app/server";

// For more full validation: https://valibot.dev/guides/introduction/

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

type ReturnType = {
	name: string;
	resources: {
		name: string;
		icon: string;
		id: number;
		value: number;
		cityId: number;
		resourceId: number;
	}[];
	id: number;
	characterId: number;
	cityId: number;
	population: number;
	workers: number;
};

async function get(): Promise<ReturnType[]> {
	const existing = await getCities();

	const cities = existing.map(({ city, resources, ...rest }) => ({
		...rest,
		name: city.name,
		resources: resources.map(({ resource, ...resourceRest }) => ({
			...resourceRest,
			name: resource.name,
			icon: resource.iconPath
		}))
	}));

	return cities;
}

export const getResources = query(get);
