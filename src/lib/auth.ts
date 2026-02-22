import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db/index";

export const auth = betterAuth({
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	database: drizzleAdapter(db, {
		provider: "sqlite", // or "mysql", "sqlite"
	}),
});