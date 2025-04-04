import type { CustomMap, MapType } from '$lib/types/mapTypes';

const wo: MapType = {
	name: 'Westeros',
	type: 'world',
	imagePath: '/map1.jpg'
};

const winterfellO: MapType = {
	name: 'Winterfell',
	type: 'city',
	imagePath: '/map2.webp'
};

const kingsLandingO: MapType = {
	name: "King's Landing",
	type: 'city',
	imagePath: '/map3.webp'
};

export const world: CustomMap = {
	map: wo,
	previous: null,
	contains: [
		{ map: winterfellO, clickBox: { x: 730, y: 2190, width: 100, height: 80 } },
		{ map: kingsLandingO, clickBox: { x: 500, y: 1050, width: 120, height: 90 } }
	]
};

export const winterfell: CustomMap = {
	map: winterfellO,
	previous: world,
	contains: []
};

export const kingsLanding: CustomMap = {
	map: kingsLandingO,
	previous: world,
	contains: []
};

export const maps: CustomMap[] = [world, winterfell, kingsLanding];