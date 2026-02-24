import MapStore from "$lib/stores/map.svelte";
import type { MapWithClickBox, CustomMap, CityMap } from "$lib/types/mapTypes";
import { maps } from "$lib/tempData";
import { isCityMap } from "$lib/typeguards/map";

class MapController {
	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public get editMode(): boolean {
		return MapStore.editMode;
	}

	public get currentMapState(): CustomMap {
		return MapStore.currentMapState;
	}

	public get selectedBox(): MapWithClickBox | null {
		return MapStore.selectedBox;
	}

	public get currentNavigationHover(): MapWithClickBox | null {
		return MapStore.currentNavigationHover;
	}

	public get submaps(): MapWithClickBox[] {
		return MapStore.currentMapState.contains;
	}

	public set editMode(v: boolean) {
		MapStore.editMode = v;
	}

	public set currentMapState(v: CustomMap) {
		MapStore.currentMapState = { ...v };
	}

	public set selectedBox(v: MapWithClickBox | null) {
		MapStore.selectedBox = v;
	}

	public set currentNavigationHover(v: MapWithClickBox | null) {
		MapStore.currentNavigationHover = v;
	}

	public get maps(): CustomMap[] {
		return maps;
	}

	// Helper getters
	public get cityMaps(): CustomMap[] {
		const cities: CustomMap[] = [];

		for (const map of maps) {
			if (isCityMap(map.map)) {
				cities.push(map);
			}
		}

		return cities;
	}

	public get cities(): CityMap[] {
		const cities: CityMap[] = [];

		for (const map of this.cityMaps) {
			// can be replaced with maps directly instead
			if (isCityMap(map.map)) {
				cities.push(map.map);
			}
		}

		return cities;
	}

	public get ownedCities(): CityMap[] {
		return this.cities.filter((city) => city.city.owned && city.city.unlocked);
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public getMapByName(name: string) {
		return this.maps.find((map) => map.map.name === name);
	}

	public addSubmap(newSubmap: MapWithClickBox) {
		MapStore.currentMapState.contains = [...this.currentMapState.contains, newSubmap];
	}

	public removeSubmapByName(toRemove: string): boolean {
		const len = this.currentMapState.contains.length;

		this.currentMapState.contains = this.currentMapState?.contains.filter((map) => map.map?.name !== toRemove);

		return len > this.currentMapState.contains.length;
	}

	public getSubMapByName(name: string): MapWithClickBox | undefined {
		return this.submaps.find((map) => map.map?.name === name);
	}

	// convert to getter maybe
	public isSelectedBoxInCurrentMap(): boolean {
		if (!this.selectedBox) {
			return false;
		}
		return !!this.getSubMapByName(this.selectedBox.map.name);
	}
}

const inst = new MapController();

export default inst;