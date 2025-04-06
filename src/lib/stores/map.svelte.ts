import type { MapWithClickBox, CustomMap } from '$lib/types/mapTypes';
import { world } from '$lib/tempData';

let _editMode: boolean = $state(false);
let _currentMapState: CustomMap = $state(world);
let _selectedBox: MapWithClickBox | null = $state(null);

class Store {
    public static get editMode(): boolean {
        return _editMode;
    }
    public static get currentMapState(): CustomMap | null {
        return _currentMapState;
    }
    public static get slectedBox(): MapWithClickBox | null {
        return _selectedBox;
    }
    public static set editMode(value: boolean) {
        _editMode = value;
    }
    public static set currentMapState(value: CustomMap) {
        _currentMapState = value;
    }
    public static set selectedBox(value: MapWithClickBox | null) {
        _selectedBox = value;
    }
}

export default Store;