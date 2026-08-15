import type { MapWithClickBox, CustomMap } from "#lib/types/mapTypes.js";

import { world } from "#lib/tempData.js";

const Store = $state<{
	editMode: boolean;
	currentMapState: CustomMap;
	selectedBox: MapWithClickBox | null;
	currentNavigationHover: MapWithClickBox | null;
}>({
	editMode: false,
	currentMapState: world,
	selectedBox: null,
	currentNavigationHover: null,
});

export default Store;