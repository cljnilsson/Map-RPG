import { db } from "$lib/server/db";
import { flags } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

// TODO ensure the values are valid before loading

export function load({ params }) {
	return {
		city: params.city,
		plot: params.identifier,
	};
}