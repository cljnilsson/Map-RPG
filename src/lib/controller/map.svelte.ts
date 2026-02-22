import MapStore from "$lib/stores/map.svelte";
import type { MapWithClickBox, CustomMap, CityMap } from "$lib/types/mapTypes";
import { maps } from "$lib/tempData";
import { isCityMap } from "$lib/typeguards/map";

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

	public static get maps(): CustomMap[] {
		return maps;
	}

	// Helper getters
	public static get cityMaps(): CustomMap[] {
		const cities: CustomMap[] = [];

		for (const map of maps) {
			if (isCityMap(map.map)) {
				cities.push(map);
			}
		}

		return cities;
	}

	public static get cities(): CityMap[] {
		const cities: CityMap[] = [];

		for (const map of MapController.cityMaps) {
			// can be replaced with maps directly instead
			if (isCityMap(map.map)) {
				cities.push(map.map);
			}
		}

		return cities;
	}

	public static get ownedCities(): CityMap[] {
		return MapController.cities.filter((city) => city.city.owned && city.city.unlocked);
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static getMapByName(name: string) {
		return MapController.maps.find((map) => map.map.name === name);
	}

	public static addSubmap(newSubmap: MapWithClickBox) {
		MapStore.currentMapState.contains = [...MapController.currentMapState.contains, newSubmap];
	}

	public static removeSubmapByName(toRemove: string): boolean {
		const len = MapController.currentMapState.contains.length;

		MapController.currentMapState.contains = MapController.currentMapState?.contains.filter(
			(map) => map.map?.name !== toRemove,
		);

		return len > MapController.currentMapState.contains.length;
	}

	public static getSubMapByName(name: string): MapWithClickBox | undefined {
		return MapController.submaps.find((map) => map.map?.name === name);
	}

	// convert to getter maybe
	public static isSelectedBoxInCurrentMap(): boolean {
		if (!MapController.selectedBox) {
			return false;
		}
		return !!MapController.getSubMapByName(MapController.selectedBox.map.name);
	}
}