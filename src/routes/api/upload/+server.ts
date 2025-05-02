import type { RequestHandler } from "./$types";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.formData();
	const file = data.get("image") as File;

	if (!file || !file.type.startsWith("image/")) {
		return new Response("Invalid file type", { status: 400 });
	}

	// Convert Blob to buffer
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	// Save to static/uploads/
	const filename = `${randomUUID()}-${file.name}`;
	const uploadDir = path.resolve("static/uploads");
	const filepath = path.join(uploadDir, filename);

	// Ensure directory exists
	fs.mkdirSync(uploadDir, { recursive: true });

	fs.writeFileSync(filepath, buffer);

	return new Response(JSON.stringify({ path: `/uploads/${filename}` }), {
		headers: { "Content-Type": "application/json" }
	});
};
