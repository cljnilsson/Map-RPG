/*import * as auth from "$lib/server/auth";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async (event) => {
	if (!event.locals.session) {
		return new Response("Unauthorized", { status: 401 });
	}

	await auth.invalidateSession(event.locals.session.id);
	auth.deleteSessionTokenCookie(event);

	// Redirect using standard Response for API route
	return new Response(null, {
		status: 303,
		headers: {
			Location: "/login"
		}
	});
};
*/
