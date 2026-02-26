export type LogChunk = { text: string | number; color: string };

export type Log = {
	timestamp: Date;
	message: LogChunk[];
	color?: string;
	type: "info" | "error" | "warning";
};