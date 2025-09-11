import type { Handle } from "@sveltejs/kit";
import * as auth from "$lib/server/auth.js";
import { dev } from "$app/environment";

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


