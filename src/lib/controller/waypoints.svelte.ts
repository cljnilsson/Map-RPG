import type { pos } from "$lib/utils/math";
import type { Path } from "$lib/types/waypoint";
import { removePath } from "$lib/api/waypoint.remote";
import type { WaypointPathCollection } from "$lib/types/waypoint";

// Can be const because we'll only ever modify a key directly not the whole object
const Store: {
	waypoints: Path[];
	currentPos: pos | undefined;
	nodes: pos[];
	waypointPathCollection: WaypointPathCollection[];
	currentWaypointParent:
		| {
				id: number;
				name: string;
		  }
		| undefined;
} = $state({
	waypointPathCollection: [],
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

	public get waypointPathCollection() {
		return Store.waypointPathCollection;
	}

	public set waypointPathCollection(v: WaypointPathCollection[]) {
		if (!this.validateAllPathNodes(v)) {
			console.warn("Invalid path nodes set to waypointPathCollection");
		}
		Store.waypointPathCollection = v;
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

	public validateAllPathNodes(paths: WaypointPathCollection[]): boolean {
		let valid = true;

		for (const w of paths) {
			const result = this.validateJoinedNodes(w.paths);
			console.log(`paths are valid (${w.name}) ${result}`);
			if (!result) {
				valid = false;
			}
		}

		return valid;
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

	public changeCurrentCollection(val: string) {
		console.log(this.waypointPathCollection);
		const current = this.waypointPathCollection.filter((v) => v.name === val)[0];
		// unsure if this screws up mutation or not
		this.currentWaypointParent = { id: current.id, name: current.name };

		// Hardcoded nonsense
		/*this.nodes = [
      { x: 50, y: 50 },
      { x: 150, y: 150 },
      { x: 500, y: 500 },
      { x: 300, y: 200 },
      ];*/

		// last node needs to be added seperately by this method
		this.nodes = current.paths.map((v) => v.from);
		this.nodes = [...this.nodes, current.paths[current.paths.length - 1].to];

		this.waypoints = current.paths;

		this.currentPos = {
			...this.waypoints[0].from,
		};
	}
}

const instance = new WaypointController();

export default instance;