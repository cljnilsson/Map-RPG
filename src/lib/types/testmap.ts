/** A doorway/marker on a source map, independent of its destination's definition. */
export type AtlasLink = {
	/** Unique within the source map, including multiple doors to the same destination. */
	id: string;
	destinationId: string;
	/** Percentages of the source map's visible image. */
	x: number;
	y: number;
};

/** Reusable location; it has no single parent or fixed position on another map. */
export type AtlasLocation = {
	id: string;
	name: string;
	kind: string;
	icon: string;
	description: string;
	image: string;
	viewBox?: string;
	features: string[];
	links: AtlasLink[];
};