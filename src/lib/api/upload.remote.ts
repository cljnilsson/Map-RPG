import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import * as v from "valibot";
import { command } from "$app/server";

const UploadSchema = v.object({
	image: v.custom<File>((file) => file instanceof File && file.type.startsWith("image/"), "Invalid image file"),
});

type UploadData = v.InferOutput<typeof UploadSchema>;

async function upload({ image }: UploadData): Promise<{ success: boolean; path?: string; error?: string }> {
	if (!image) {
		return { success: false, error: "Missing file" };
	}

	const arrayBuffer = await image.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	const filename = `${randomUUID()}-${image.name}`;
	const uploadDir = path.resolve("static/uploads");
	const filepath = path.join(uploadDir, filename);

	fs.mkdirSync(uploadDir, { recursive: true });
	fs.writeFileSync(filepath, buffer);

	return { success: true, path: `/uploads/${filename}` };
}

export const uploadOneImage = command(UploadSchema, upload);