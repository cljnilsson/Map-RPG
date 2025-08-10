import MapStore from "$lib/stores/map.svelte";
import type { MapWithClickBox, CustomMap } from "$lib/types/mapTypes";

export default class MapController {
	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public static get editMode(): boolean {
		return MapStore.editMode;
	}

	public static get currentMapState(): CustomMap {
		return MapStore.currentMapState;
	}

	public static get selectedBox(): MapWithClickBox | null {
		return MapStore.selectedBox;
	}

	public static get currentNavigationHover(): MapWithClickBox | null {
		return MapStore.currentNavigationHover;
	}

	public static get submaps(): MapWithClickBox[] {
		return MapStore.currentMapState.contains;
	}

	public static set editMode(v: boolean) {
		MapStore.editMode = v;
	}

	public static set currentMapState(v: CustomMap) {
		MapStore.currentMapState = { ...v };
	}

	public static set selectedBox(v: MapWithClickBox | null) {
		MapStore.selectedBox = v;
	}

	public static set currentNavigationHover(v: MapWithClickBox | null) {
		MapStore.currentNavigationHover = v;
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static addSubmap(newSubmap: MapWithClickBox) {
		MapStore.currentMapState.contains = [...this.currentMapState.contains, newSubmap];
	}

	public static removeSubmapByName(toRemove: string): boolean {
		const len = this.currentMapState.contains.length;

		this.currentMapState.contains = this.currentMapState?.contains.filter((map) => map.map?.name !== toRemove);

		return len < this.currentMapState.contains.length;
	}

	public static getSubMapByName(name: string): MapWithClickBox | undefined {
		return this.submaps.find((map) => map.map?.name === name);
	}

	// convert to getter maybe
	public static isSelectedBoxInCurrentMap(): boolean {
		if (!this.selectedBox) {
			return false;
		}
		return !!this.getSubMapByName(this.selectedBox.map.name);
	}
}
