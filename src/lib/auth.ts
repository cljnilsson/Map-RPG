import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "$lib/server/db/index";

export const auth = betterAuth({
	/*basePath: "/api/auth",*/
	baseURL: "http://localhost:1420", // change based on dev etc in the future
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
	},
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
});