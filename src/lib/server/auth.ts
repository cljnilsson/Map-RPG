import type { RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "$lib/server/db";
import * as table from "$lib/server/db/schema";
import type { InferInsertModel } from "drizzle-orm";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export const sessionCookieName = "auth-session";

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createSession(token: string, userId: number) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: InferInsertModel<typeof table.session> = {
		token: sessionId,
		userId,
		expiresAt: Math.floor(Date.now() + DAY_IN_MS * 30)
	};

	await db.insert(table.session).values(session);

	return session;
}

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const [result] = await db
		.select({
			// Adjust user table here to tweak returned data
			user: { id: table.user.id, username: table.user.username },
			session: table.session
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.token, sessionId));

	if (!result) {
		return { session: null, user: null };
	}
	const { session, user } = result;

	const sessionExpired = Date.now() >= session.expiresAt;
	if (sessionExpired) {
		await db.delete(table.session).where(eq(table.session.id, session.id));
		return { session: null, user: null };
	}

	const renewSession = Date.now() >= session.expiresAt - DAY_IN_MS * 15;
	if (renewSession) {
		session.expiresAt = Date.now() + DAY_IN_MS * 30;
		await db.update(table.session).set({ expiresAt: session.expiresAt }).where(eq(table.session.id, session.id));
	}

	return { session, user };
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: number) {
	await db.delete(table.session).where(eq(table.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: number) {
	console.log("Setting cookie: ", sessionCookieName, "with token:", token, "expires at:", new Date(expiresAt));
	event.cookies.set(sessionCookieName, token, {
		expires: new Date(expiresAt),
		httpOnly: true,
		sameSite: "lax",
		secure: true,
		path: "/"
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(sessionCookieName, {
		path: "/"
	});
}
