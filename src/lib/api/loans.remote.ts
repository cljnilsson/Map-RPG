import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { loans } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";

async function getLoans() {
	return await db.query.loans.findMany({
		with: {
			city: true,
			resource: true
		}
	});
}

async function updateLoan(cityDataId: number, resourceId: number, value: number): Promise<boolean> {
	const rows = await db
		.update(loans)
		.set({ paid: value })
		.where(and(eq(loans.cityId, cityDataId), eq(loans.resourceId, resourceId)));

	return rows.changes > 0;
}

type GetReturnType = {
	full: number;
	paid: number;
	resource: string;
	date: string;
};

async function get(): Promise<GetReturnType[]> {
	const existing = await getLoans();

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

const LoanArraySchema = v.array(LoanSchema);

type LoanArrayData = v.InferOutput<typeof LoanArraySchema>;

async function post(body: LoanArrayData) {
	console.log(body);
	const failed: LoanArrayData = [];
	
	for (const resource of body) {
		const success = updateLoan(resource.cityDataId, resource.resourceId, resource.value);
		if(!success) {
			failed.push(resource);
		}
	}

	if(failed.length > 0) {
		return { success: false, failed };
	}
	
	return { success: true };
}

export const postResources = command(LoanArraySchema, post);
export const getResources = query(get);
