import type { MapWithClickBox, CustomMap } from '$lib/types/mapTypes';
import { world } from '$lib/tempData';

/*const editMode: boolean = $state(true);
const currentMapState: CustomMap = $state(world);
const selectedBox: MapWithClickBox | null = $state(null);*/

const Store = $state<{editMode: boolean, currentMapState: CustomMap, selectedBox: MapWithClickBox | null}>({editMode: false, currentMapState: world, selectedBox: null});

export default Store;