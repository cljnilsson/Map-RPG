import type { CustomMap, MapType } from '$lib/types/mapTypes';

const wo: MapType = {
	name: 'Westeros',
	type: 'world',
	imagePath: '/map1.jpg'
};

const winterfellO: MapType = {
	name: 'Winterfell',
	type: 'city',
	imagePath: '/map3.webp'
};

const kingsLandingO: MapType = {
	name: "King's Landing",
	type: 'city',
	imagePath: '/map2.webp'
};

const starkKeepO: MapType = {
	name: "Winterfeel Keep",
	type: 'building',
	imagePath: "starkKeep.webp"
}

export const world: CustomMap = {
	map: wo,
	previous: null,
	contains: [
		{ map: kingsLandingO, clickBox: { x: 715, y: 2130, width: 100, height: 80, rotation: 0 } },
		{ map: winterfellO, clickBox: { x: 500, y: 1000, width: 120, height: 90, rotation: 0 } }
	]
};

export const winterfell: CustomMap = {
	map: winterfellO,
	previous: world,
	contains: [
		{ map: starkKeepO, clickBox: { x: 800, y: 200, width: 400, height: 220, rotation: 45 } }
	]
};

export const kingsLanding: CustomMap = {
	map: kingsLandingO,
	previous: world,
	contains: []
};

export const starkKeep: CustomMap = {
	map: starkKeepO,
	previous: winterfell,
	contains: []
};

export const maps: CustomMap[] = [world, winterfell, kingsLanding, starkKeep];