import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { loans } from "$lib/server/db/schema";
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
};

async function get(): Promise<GetReturnType[]> {
	const existing = await getAllLoans();

	const loans = existing.map(({ resource, paid, full, timestamp }) => ({
		paid,
		full,
		date: timestamp,
		resource: resource.name
	}));

	return loans;
}


const LoanSchema = v.object({
	cityDataId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	resourceId: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
	value: v.pipe(v.number(), v.integer(), v.toMinValue(0))
});


type LoanData = v.InferOutput<typeof LoanSchema>;

async function createPost(body: LoanData) {
	console.log(body);
	let failed: LoanData | false = false;

	const success = createLoan(body.cityDataId, body.resourceId, body.value);
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

	const success = updateOneLoan(body.cityDataId, body.resourceId, body.value);
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
