type MapType = {
    name: string;
    type: 'city' | 'world' | 'building';
    imagePath: string;
    unlocked: boolean;
};

type ClickBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
}

type MapWithClickBox = {
    map: MapType;
    clickBox: ClickBox;
}

type CustomMap = {
    map: MapType;
    previous: CustomMap | null;
    contains: MapWithClickBox[];
};

export type { MapType, ClickBox, MapWithClickBox, CustomMap };