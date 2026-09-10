import { dev } from "$app/env";
import type { RequestHandler } from "@sveltejs/kit";
import { isThemeName, themeCookieName } from "#lib/themes.js";

export const POST: RequestHandler = async ({ cookies, request }) => {
	let body: unknown;

	try {
		body = await request.json();
	} catch {
		return Response.json({ message: "Theme payload must be JSON." }, { status: 400 });
	}

	const theme = body && typeof body === "object" && "theme" in body ? body.theme : undefined;
	if (typeof theme !== "string" || !isThemeName(theme)) {
		return Response.json({ message: "Unknown theme." }, { status: 400 });
	}

	cookies.set(themeCookieName, theme, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365,
		httpOnly: true,
		sameSite: "lax",
		secure: !dev,
	});

	return Response.json({ theme });
};