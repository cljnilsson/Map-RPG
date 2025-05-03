import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		// Optionally redirect if layout needs auth
		// return redirect(302, '/login');
	}

	return {
		user: locals.user
	};
};
