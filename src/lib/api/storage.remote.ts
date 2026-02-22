import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { storage } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";

async function getAllStorage() {
	return await db.query.storage.findMany({
		with: {
			city: true,
		},
	});
}

async function getStorageByCity(cityDataId: number) {
	return await db.query.storage.findMany({
		where: (storage, { eq }) => eq(storage.cityId, cityDataId),
		with: {
			city: true,
		},
	});
}

async function cityDataExists(id: number): Promise<boolean> {
	const found = await db.query.cityData.findFirst({
		where: (cityData, { eq }) => eq(cityData.id, id),
	});

	return found != undefined;
}

async function getCityDataOwnerById(id: number) {
	const data = await db.query.cityData.findFirst({
		where: (cityData, { eq }) => eq(cityData.id, id),
		with: {
			city: true,
			character: {
				with: {
					user: true,
				},
			},
		},
	});

	return data?.character.user;
}

/*
async function updateOneLoan(cityDataId: number, resourceId: number, value: number): Promise<boolean> {
	const rows = await db
		.update(loans)
		.set({ paid: value })
		.where(and(eq(loans.cityId, cityDataId), eq(loans.resourceId, resourceId)));

	return rows.changes > 0;
}*/

async function addOneToStorage(cityId: number, key: string, amount: number) {
	const rows = await db.insert(storage).values([
		{
			cityId,
			itemKey: key,
			amount: amount,
		},
	]);

	return rows.changes > 0;
}

async function removeOneFromStorage(cityId: number, key: string, amount: number) {
	// TODO, if amount is less than current amount just reduce amount instead
	const rows = await db
		.delete(storage)
		.where(and(eq(storage.cityId, cityId), eq(storage.itemKey, key)))
		.limit(1);

	return rows.changes > 0;
}

type GetReturnType = {
	id: number;
	itemKey: string;
	amount: number;
	cityId: number;
	city: {
		id: number;
		characterId: number;
		cityId: number;
		population: number;
		workers: number;
	};
};

const GetOneSchema = v.object({
	cityId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
});

type GetOneData = v.InferOutput<typeof GetOneSchema>;

async function get(body: GetOneData): Promise<GetReturnType[] | undefined> {
	const existing = await getStorageByCity(body.cityId);

	return existing;
}

async function getAll(): Promise<GetReturnType[]> {
	const existing = await getAllStorage();

	return existing;
}

const AddOneSchema = v.object({
	cityId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	key: v.string(),
	amount: v.pipe(v.number(), v.integer(), v.toMinValue(1)),
});

type AddOneData = v.InferOutput<typeof AddOneSchema>;

async function addOne(body: AddOneData): Promise<boolean> {
	const existing = await cityDataExists(body.cityId);

	if (!existing) {
		console.warn("Trying to add storage to citydata that does not exist", body.cityId);
		return false;
	}

	const user = await getCityDataOwnerById(body.cityId);

	if (!user || user.id !== getUser().id) {
		console.warn("Trying to add to storage from citydata that is not owned by the logged in user", body.cityId);
		return false;
	}

	const addedToStorage = await addOneToStorage(body.cityId, body.key, body.amount);

	if (!addedToStorage) {
		console.warn("Something went wrong when trying to add to storage");
		return false;
	}

	return true;
}

const RemoveOneSchema = v.object({
	cityId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	key: v.string(),
	amount: v.pipe(v.number(), v.integer(), v.toMinValue(1)),
});

type RemoveOneData = v.InferOutput<typeof RemoveOneSchema>;

async function removeOne(body: RemoveOneData): Promise<boolean> {
	const existing = await cityDataExists(body.cityId);

	if (!existing) {
		console.warn("Trying to remove storage from citydata that does not exist", body.cityId);
		return false;
	}

	const user = await getCityDataOwnerById(body.cityId);

	if (!user || user.id !== getUser().id) {
		console.warn("Trying to remove storage from citydata that is not owned by the logged in user", body.cityId);
		return false;
	}

	const removedFromStorage = await removeOneFromStorage(body.cityId, body.key, body.amount);

	if (!removedFromStorage) {
		console.log("Something went wrong when trying to remove from storage");
		return false;
	}

	return true;
}

export const getStorages = query(getAll);
export const getStorage = command(GetOneSchema, get);
export const addItem = command(AddOneSchema, addOne);
export const removeItem = command(RemoveOneSchema, removeOne);