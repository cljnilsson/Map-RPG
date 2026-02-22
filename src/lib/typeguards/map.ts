import type { MapType, CityMap, BuildingMap, WorldMap } from "$lib/types/mapTypes";

function isCityMap(map: MapType): map is CityMap {
	return "type" in map && map.type === "city";
}

function isBuildingMap(map: MapType): map is BuildingMap {
	return "type" in map && map.type === "building";
}

function isWorldMap(map: MapType): map is WorldMap {
	return "type" in map && map.type === "world";
}

export { isCityMap, isBuildingMap, isWorldMap };