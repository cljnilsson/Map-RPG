type BaseResource = {
	name: string;
	iconPath: string;
}
type Resource = BaseResource & {
	amount: number;
};

export type { BaseResource, Resource };
