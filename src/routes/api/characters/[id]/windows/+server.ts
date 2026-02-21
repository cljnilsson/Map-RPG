import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { windowPositions } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import type { RequestHandler } from "@sveltejs/kit";
import { auth } from "$lib/auth";

async function getAllWindowPositions(characterId: number) {
  const exists = await db
    .select()
    .from(windowPositions)
    .where(eq(windowPositions.characterId, characterId));

  return exists;
}

export const GET: RequestHandler = async ({ params, request }) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session || !session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = params!.id;

  return json({
    success: true,
    positions: await getAllWindowPositions(Number(id)),
  });
};
