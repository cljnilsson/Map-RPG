// Simplified data without ids
type LayoutData = {
	user: {
		id: number;
		username: string;
	} | null;
	userFlags: {name: string, value: number}[];
};

export type {LayoutData};
