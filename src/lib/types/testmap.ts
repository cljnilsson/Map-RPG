/** Isolated atlas prototype. Positions are percentages of the parent's visible map. */
export type AtlasLocation = {
	id: string;
	name: string;
	kind: string;
	icon: string;
	description: string;
	image: string;
	viewBox?: string;
	x: number;
	y: number;
	features: string[];
	children: AtlasLocation[];
};