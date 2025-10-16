import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { resources } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";

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

async function getCityDataById(id: number) {
	return await db.query.cityData.findFirst({
		where: (cityData, { eq }) => eq(cityData.id, id),
		with: {
			city: true,
			character: {
				with: {
					user: true
				}
			}
		}
	});
}

async function updateResource(cityDataId: number, resourceId: number, value: number): Promise<boolean> {
	const rows = await db
		.update(resources)
		.set({ value })
		.where(and(eq(resources.cityId, cityDataId), eq(resources.resourceId, resourceId)));

	return rows.changes > 0;
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
	const failed: ResourceArrayData = [];
	const user = getUser();

	for (const resource of body) {
		const cityData = await getCityDataById(resource.cityDataId);
		if(cityData) {
			console.log(cityData.character.user?.id);
			if(!cityData.character.user?.id || cityData.character.user.id !== user.id) {
				failed.push(resource);
				console.log(`User ${user.id} tried to update cityData ${resource.cityDataId} (${cityData.city.name}) they don't own.`);
				continue;
			}
		}

		const success = updateResource(resource.cityDataId, resource.resourceId, resource.value);
		if(!success) {
			failed.push(resource);
		}
	}

	if(failed.length > 0) {
		return { success: false, failed };
	}
	
	return { success: true };
}

export const postResources = command(ResourceArraySchema, post);
export const getResources = query(get);
