import { auth } from "#lib/auth.js";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ request }) => {
	const session = await auth.api.getSession({ headers: request.headers });

	if (!session?.user) {
		redirect(303, "/login");
	}
};