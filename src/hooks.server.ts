import { dbCheckup } from "$lib/data/bootstrap"; // Runs health checkup for db
import { auth } from "$lib/auth"; // path to your auth file
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { dev } from "$app/environment";
import type { RequestEvent } from "@sveltejs/kit";

dbCheckup();

export async function handle({
  event,
  resolve,
}: {
  event: RequestEvent;
  resolve: (event: RequestEvent) => Response | Promise<Response>;
}): Promise<Response> {
  if (
    dev &&
    event.url.pathname === "/.well-known/appspecific/com.chrome.devtools.json"
  ) {
    return new Response(undefined, { status: 404 });
  }
  return svelteKitHandler({ event, resolve, auth, building });
}

/*export const handle: Handle = async ({ event, resolve }) => {
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
};*/
