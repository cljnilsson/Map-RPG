import { getRequestEvent } from "$app/server";
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/auth";

export async function matchingUserId(userId: string, caller: string = "") {
	const { request } = getRequestEvent();

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session?.user) {
		console.log(caller, "no user exists at all");
		return false;
	}

	if (session.user.id !== userId) {
		console.log(caller, "the user does not match session");
		return false;
	}

	console.log(caller, "user exists and matches, allowing access!");
	return true;
}

export async function getUser(caller: string = "") {
	const { request } = getRequestEvent();

	const session = await auth.api.getSession({
		headers: request.headers,
	});

	if (!session?.user) {
		console.log(caller, " no user exists (not logged in)");
		redirect(307, "/login");
	}

	console.log(caller, " user exists allowing access!");
	return session.user;
}