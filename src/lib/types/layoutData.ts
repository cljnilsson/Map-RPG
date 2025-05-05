// Simplified data without ids
type LayoutData = {
	user: {
		username: string
	} | null;
	userFlags: {name: string, value: number}[];
};

export type {LayoutData};
