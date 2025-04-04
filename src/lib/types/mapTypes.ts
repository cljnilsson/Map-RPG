type MapType = {
    name: string;
    type: 'city' | 'world' | 'building';
    imagePath: string;
};

type ClickBox = {
    x: number;
    y: number;
    width: number;
    height: number;
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