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

	public static set editMode(v: boolean) {
		MapStore.editMode = v;
	}

	public static set currentMapState(v: CustomMap) {
		MapStore.currentMapState = v;
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
}
