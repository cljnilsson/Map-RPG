import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { storage } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";

async function getAllStorage() {
	return await db.query.storage.findMany({
		with: {
			city: true
		}
	});
}

async function getStorageByCity(cityDataId: number) {
	return await db.query.storage.findMany({
		where: (storage, { eq }) => eq(storage.cityId, cityDataId),
		with: {
			city: true
		}
	});
}

async function cityDataExists(id: number) : Promise<boolean> {
	const found = await db.query.cityData.findFirst({
		where: (cityData, { eq }) => eq(cityData.id, id),
	});

	return found != undefined;
}

/*
async function getResourceByName(name: string) {
	return await db.select().from(resource).where(eq(resource.name, name)).get();
}

async function getCity(name: string) {
	return await db.select().from(city).where(eq(city.name, name)).get();
}

async function getCityData(characterId: number, cityId: number) {
	return await db.select().from(cityData).where(and(eq(cityData.characterId, characterId), eq(cityData.cityId, cityId))).get();
}

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
			amount: amount
		}
	]);

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
	cityId: v.pipe(v.number(), v.integer(), v.toMinValue(0))
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
	amount: v.pipe(v.number(), v.integer(), v.toMinValue(1))
});

type AddOneData = v.InferOutput<typeof AddOneSchema>;

async function addOne(body: AddOneData): Promise<boolean> {
	const existing = await cityDataExists(body.cityId);

	if (!existing) {
		console.log("Trying to add storage to citydata that does not exist", body.cityId)
		return false;
	}

	const addedToStorage = await addOneToStorage(body.cityId, body.key, body.amount);

	if (!addedToStorage) {
		console.log("Something went wrong when trying to add to storage");
		return false;
	}

	return true;
}

/*
const LoanSchema = v.object({
	charaacterId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	cityName: v.string(),
	resourceName: v.string(),
	value: v.pipe(v.number(), v.integer(), v.toMinValue(0))
});


type LoanData = v.InferOutput<typeof LoanSchema>;*/
/*
async function createPost(body: LoanData) {
	console.log(body);
	let failed: LoanData | false = false;

	// Clean up returns later
	const resource = await getResourceByName(body.resourceName);
	console.log(resource);
	if(!resource) {
		return { success: false, failed };
	}

	const city = await getCity(body.cityName);
	console.log(city);
	if(!city) {
		return { success: false, failed };
	}

	const cityData = await getCityData(body.charaacterId, city.id);
	console.log(cityData);
	if(!cityData) {
		return { success: false, failed };
	}

	const success = await createLoan(body.value, resource.id, cityData.id);
	console.log(success);
	if(!success) {
		failed = body;
	}
	
	if(failed) {
		return { success: false, failed };
	}
	
	return { success: true };
}

async function updatePost(body: LoanData) {
	console.log(body);
	let failed: LoanData | false = false;

	// Clean up returns later
	const resource = await getResourceByName(body.resourceName);
	if(!resource) {
		return { success: false, failed };
	}

	const city = await getCity(body.cityName);
	if(!city) {
		return { success: false, failed };
	}

	const cityData = await getCityData(body.charaacterId, city.id);
	if(!cityData) {
		return { success: false, failed };
	}

	const success = updateOneLoan(cityData.id, resource.id, body.value);
	if(!success) {
		failed = body;
	}

	if(failed) {
		return { success: false, failed };
	}
	
	return { success: true };
}*/

//export const postLoan = command(LoanSchema, createPost);
//export const updateLoan = command(LoanSchema, updatePost);
export const getStorages = query(getAll);
export const getStorage = command(GetOneSchema, get);
export const addItem = command(AddOneSchema, addOne);
