import type { Handle } from "@sveltejs/kit";
import * as auth from "$lib/server/auth.js";
import { dev } from "$app/environment";

let started = false;

export const handle: Handle = async ({ event, resolve }) => {
	// 🔹 Start the interval once when server boots
	if (!started) {
		started = true;

		// Repeat every 60s
		const interval = 60;
		setInterval(() => {
			runTask();
		}, interval * 1000);
	}

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

function runTask() {
	console.log("Running server task at", new Date().toISOString());
	const limit: number = 200; // Hardcoded until a proper gameplay inplementation is made
	
}
