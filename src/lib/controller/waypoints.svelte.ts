import type { pos } from "$lib/utils/math";
import type { Path } from "$lib/types/waypoint";
import { removePath } from "$lib/api/waypoint.remote";
import type { WaypointPathCollection } from "$lib/types/waypoint";

// Can be const because we'll only ever modify a key directly not the whole object
const Store: {
	waypoints: Path[];
	currentPos: pos | undefined;
	nodes: pos[];
	currentWaypointParent:
		| {
				id: number;
				name: string;
		  }
		| undefined;
} = $state({
	waypoints: [],
	currentPos: undefined,
	nodes: [],
	currentWaypointParent: undefined,
});

class WaypointController {
	public get currentWaypointParent() {
		return Store.currentWaypointParent;
	}

	public set currentWaypointParent(v:
		| {
				id: number;
				name: string;
		  }
		| undefined,) {
		Store.currentWaypointParent = v;
	}

	public get waypoints() {
		return Store.waypoints;
	}

	public set waypoints(v: Path[]) {
		Store.waypoints = v;
	}

	public get nodes() {
		return Store.nodes;
	}

	public set nodes(v: pos[]) {
		Store.nodes = v;
	}

	public get currentPos() {
		return Store.currentPos;
	}

	public set currentPos(v: pos | undefined) {
		Store.currentPos = v;
	}

	public validateJoinedNodes(toCheck: Path[], epsilon = 0.001): boolean {
		if (toCheck.length <= 1) return true;

		function isClose(a: number, b: number) {
			return Math.abs(a - b) < epsilon;
		}

		for (let i = 0; i < toCheck.length - 1; i++) {
			const current = toCheck[i];
			const next = toCheck[i + 1];

			const xMatch = isClose(current.to.x, next.from.x);
			const yMatch = isClose(current.to.y, next.from.y);

			if (!xMatch || !yMatch) {
				return false;
			}
		}

		return true;
	}

	public validateAllPathNodes(paths: WaypointPathCollection[]) {
		for (const w of paths) {
			console.log(`paths are valid (${w.name}) ${this.validateJoinedNodes(w.paths)}`);
		}
	}

	public removeOneWaypoint(p: Path) {
		if (!this.currentWaypointParent) {
			console.warn("currentWaypointParent is not set but required");
			return;
		}
		this.waypoints = this.waypoints.filter((w) => !(w.angle === p.angle && w.from === p.from && w.to === p.to));

		// Should do this first ideally but it works for now
		removePath({
			...p,
			parentId: this.currentWaypointParent.id,
		});
	}
}

const instance = new WaypointController();

export default instance;