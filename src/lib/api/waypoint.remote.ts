import { db } from "$lib/server/db";
import { query, command } from "$app/server";
import { waypoint, waypointNode, waypointPath } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import * as v from "valibot";
import { getUser } from "$lib/utils/remoteAuthHelper";

async function getAllWaypoints() {
	return await db.query.waypoint.findMany({
		with: {
			paths: true,
		},
	});
}

async function getWaypoint(name: string) {
	return await db.query.waypoint.findFirst({
		where: (waypoint, { eq }) => eq(waypoint.name, name),
		with: {
			paths: true,
		},
	});
}

async function getWaypointById(id: number) {
	return await db.query.waypoint.findFirst({
		where: (waypoint, { eq }) => eq(waypoint.id, id),
		with: {
			paths: true,
		},
	});
}

async function getNode(id: number) {
	return await db.query.waypointNode.findFirst({
		where: (waypoint, { eq }) => eq(waypoint.id, id),
	});
}

async function getNodeExact(
	baseId: number,
	x: number,
	y: number,
): Promise<{ x: number; y: number; id: number } | false> {
	const base = await db.query.waypoint.findFirst({
		where: (waypoint, { eq }) => eq(waypoint.id, baseId),
		with: {
			paths: {
				with: {
					from: true,
					to: true,
				},
			},
		},
	});

	if (!base) {
		return false;
	}

	let found: { x: number; y: number; id: number } | boolean = false;

	for (const wNode of base.paths) {
		if (wNode.from.x === x && wNode.from.y === y) {
			found = {
				x: wNode.from.x,
				y: wNode.from.y,
				id: wNode.from.id,
			};
			break;
		}
		if (wNode.to.x === x && wNode.to.y === y) {
			found = {
				x: wNode.to.x,
				y: wNode.to.y,
				id: wNode.to.id,
			};
			break;
		}
	}

	return found;
}

/*const SaveSchema = v.object({
  name: v.string(),
  paths: v.array(
    v.object({
      waypoint: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
      angle: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
      from: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
      to: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
    }),
  ),
});

type SaveData = v.InferOutput<typeof SaveSchema>;*/

const SaveSchema = v.object({
	name: v.string(),
	paths: v.array(
		v.object({
			//waypoint: v.pipe(v.number(), v.integer(), v.toMinValue(0)), use this only for updating
			angle: v.number(), // not using min value 0 because the value is between 0 and 1, could check for max though
			from: v.object({
				x: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
				y: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
			}),
			to: v.object({
				x: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
				y: v.pipe(v.number(), v.integer(), v.toMinValue(0)),
			}),
		}),
	),
});

type SaveData = v.InferOutput<typeof SaveSchema>;

// Assuming no data exists at all, use another endpoint to update an existing.
async function save(body: SaveData) {
	async function createBase(parentName: string) {
		const rows = await db.insert(waypoint).values([
			{
				name: parentName,
			},
		]);

		return rows.lastInsertRowid;
	}

	async function createPoint(x: number, y: number) {
		const rows = await db.insert(waypointNode).values([
			{
				x,
				y,
			},
		]);

		return rows.lastInsertRowid;
	}

	async function createPath(base: number, from: number, to: number, angle: number) {
		const rows = await db.insert(waypointPath).values([
			{
				waypoint: base,
				to,
				from,
				angle,
			},
		]);

		return rows.changes > 0;
	}

	const b = await createBase(body.name);
	const base = await getWaypointById(Number(b));

	if (!base) {
		console.error("Failed to create base");
		return false;
	}

	for (const path of body.paths) {
		const fromExists = await getNodeExact(base.id, path.from.x, path.from.y);
		const toExists = await getNodeExact(base.id, path.to.x, path.to.y);
		let fromId: number | bigint;
		let toId: number | bigint;

		if (fromExists) {
			fromId = fromExists.id;
		} else {
			fromId = await createPoint(path.from.x, path.from.y);
		}

		if (toExists) {
			toId = toExists.id;
		} else {
			toId = await createPoint(path.to.x, path.to.y);
		}

		await createPath(base.id, Number(fromId), Number(toId), path.angle);
	}

	return true;
}

type ReturnWaypoints = {
	name: string;
	id: number;
	paths: {
		id: number;
		waypoint: number;
		angle: number;
		from: number;
		to: number;
	}[];
};

const GetOneSchema = v.object({
	name: v.string(),
});

type GetOneData = v.InferOutput<typeof GetOneSchema>;

async function getOne({ name }: GetOneData): Promise<ReturnWaypoints | undefined> {
	// In theory should block requests if user is not logged in
	await getUser();

	const existing = await getWaypoint(name);

	return existing;
}

async function get(): Promise<ReturnWaypoints[]> {
	const existing = await getAllWaypoints();

	return existing;
}

export const getWaypoints = query(get);
export const getOneWaypoint = command(GetOneSchema, getOne);
export const saveWaypoint = command(SaveSchema, save);
//export const saveWaypoint = command(SaveUpdateSchema, saveUpdate);
//export const saveWaypoint = command(SaveNodeSchema, saveNode);