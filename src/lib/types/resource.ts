type BaseResource = {
	name: string;
	iconPath: string;
}
type Resource = BaseResource & {
	amount: number;
};

type CityResource = Resource & {
	production: number;
	baseLimit: number;
}

export type { BaseResource, Resource, CityResource };
