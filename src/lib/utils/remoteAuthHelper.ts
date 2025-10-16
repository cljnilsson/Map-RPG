import { getRequestEvent } from "$app/server";
import { redirect } from "@sveltejs/kit";

// TODO, since locals exist we don't need to send userId with the client.
export function matchingUserId(userId: number) {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		return false;
	} else if (locals.user.id !== userId) {
		return false;
	}

	return true;
}

export function getUser() {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		//return -1;
		redirect(307, "/login");
	}

	return locals.user;
}
