type MapType = {
	name: string;
	imagePath: string;
};

type WorldMap = MapType & {
	type: "world";
}

type BuildingMap = MapType & {
	type: "building";
	unlocked: boolean;
	upgrades: string[];
	npcs: string[];
}

type CityMap = MapType & {
	type: "city";
	owned: boolean;
	unlocked: boolean;
}

type ClickBox = {
	x: number;
	y: number;
    originalX: number; // To handle window scaling we need the original position
    originalY: number;
	width: number;
	height: number;
	rotation: number;
};

type MapWithClickBox = {
	map: MapType;
	clickBox: ClickBox;
};

type CustomMap = {
	map: MapType;
	previous: CustomMap | null;
	contains: MapWithClickBox[];
};

export type { MapType, ClickBox, MapWithClickBox, CustomMap, WorldMap, BuildingMap, CityMap };
