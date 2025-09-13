import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { loans, resource, city, cityData } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";

async function getAllLoans() {
	return await db.query.loans.findMany({
		with: {
			city: true,
			resource: true
		}
	});
}

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
}

async function createLoan(full: number, resourceId: number, cityId: number) {
	const rows = await db
		.insert(loans).values([{
			full: full,
			paid: 0,
			cityId: cityId,
			resourceId: resourceId,
		}]);

	return rows.changes > 0;
}

type GetReturnType = {
	full: number;
	paid: number;
	resource: string;
	date: string;
	cityData: {
		id: number;
		characterId: number;
		cityId: number;
	};
};

async function get(): Promise<GetReturnType[]> {
	const existing = await getAllLoans();

	const loans = existing.map(({ resource, paid, full, timestamp, city}) => ({
		paid,
		full,
		date: timestamp,
		resource: resource.name,
		cityData: {
			id: city.id,
			characterId: city.characterId,
			cityId: city.cityId
		}, 
	}));

	return loans;
}


const LoanSchema = v.object({
	charaacterId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	cityName: v.string(),
	resourceName: v.string(),
	value: v.pipe(v.number(), v.integer(), v.toMinValue(0))
});


type LoanData = v.InferOutput<typeof LoanSchema>;

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
}

export const postLoan = command(LoanSchema, createPost);
export const updateLoan = command(LoanSchema, updatePost);
export const getLoans = query(get);
