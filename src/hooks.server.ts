import type { Handle } from "@sveltejs/kit";
import * as auth from "$lib/server/auth.js";
import { dev } from "$app/environment";
import { resources } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { db } from "$lib/server/db";
import dayjs from "dayjs";

let started = false;

startBackgroundTasks(); // Ensure this runs only once when the server starts

export const handle: Handle = async ({ event, resolve }) => {
	// Ignore Chrome devtools probe in dev
	if (dev && event.url.pathname === "/.well-known/appspecific/com.chrome.devtools.json") {
		return new Response(undefined, { status: 404 });
	}

	const sessionToken = event.cookies.get(auth.sessionCookieName);

	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);

	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

function startBackgroundTasks() {
	if (started) return; // Prevent multiple timers
	started = true;

	const intervalSeconds = 60;
	setInterval(runTask, intervalSeconds * 1000);
}

async function runTask() {
	console.log("Running server task at", dayjs().format("YYYY-MM-DD HH:mm:ss"));

	const limit = 200; // Hardcoded until proper gameplay implementation
	const production = 1; // Hardcoded

	const cities = await db.query.cityData.findMany({
		with: {
			resources: { with: { resource: true } },
			city: true
		}
	});

	for (const city of cities) {
		for (const res of city.resources) {
			if (res.value < limit) {
				await db
					.update(resources)
					.set({ value: res.value + production })
					.where(and(eq(resources.cityId, city.city.id), eq(resources.resourceId, res.resource.id)));
			}
		}
	}
}
