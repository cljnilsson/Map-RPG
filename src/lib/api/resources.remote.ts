import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { resources } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";

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

async function updateResource(cityDataId: number, resourceId: number, value: number): Promise<boolean> {
	await db
		.update(resources)
		.set({ value })
		.where(and(eq(resources.cityId, cityDataId), eq(resources.resourceId, resourceId)));

	return true;
}

type GetReturnType = {
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

async function get(): Promise<GetReturnType[]> {
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

const ResourceSchema = v.object({
	cityDataId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	resourceId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	value: v.pipe(v.number(), v.integer(), v.toMinValue(0))
});

//type ResourceData = v.InferOutput<typeof ResourceSchema>;

const ResourceArraySchema = v.array(ResourceSchema);

type ResourceArrayData = v.InferOutput<typeof ResourceArraySchema>;

async function post(body: ResourceArrayData) {
	console.log(body);
	
	for (const resource of body) {
		updateResource(resource.cityDataId, resource.resourceId, resource.value);
	}

	return { success: true };
}

export const postResources = command(ResourceArraySchema, post);
export const getResources = query(get);
