import { getRequestEvent } from "$app/server";
import { redirect } from "@sveltejs/kit";

// TODO, since locals exist we don't need to send userId with the client.
export function matchingUserId(userId: number, caller: string = "") {
	const { locals, url } = getRequestEvent();

	if (!locals.user) {
		console.log(caller + " no user exists at all");
		return false;
	} else if (locals.user.id !== userId) {
		console.log(caller + " the user does not match locals");
		return false;
	}
	console.log(caller + " user exists and matches, allowing access!");
	return true;
}

export function getUser(caller: string = "") {
	const { locals } = getRequestEvent();
	if (!locals.user) {
		//return -1;
		console.log(caller + " no user exists (not logged in)");
		redirect(307, "/login");
	}
	console.log(caller + " user exists allowing access!");
	return locals.user;
}
