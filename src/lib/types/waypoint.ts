import type { pos } from "$lib/utils/math";

export type Path = {
	from: pos;
	to: pos;
	angle: number;
};

export type WaypointPathCollection = {
	id: number;
	name: string;
	paths: Path[];
};