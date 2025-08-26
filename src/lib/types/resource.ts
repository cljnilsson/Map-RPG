type BaseResource = {
	name: string;
	iconPath: string;
}

type Resource = BaseResource & {
	amount: number;
};

type DBResource = Resource & {
	resourceId: number;
	cityId: number; // actualyl cityData behind the scenes
}

type CityResource = DBResource & {
	production: number;
	baseLimit: number;
}

export type { BaseResource, Resource, CityResource };
