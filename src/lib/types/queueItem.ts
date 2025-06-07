type QueueItemType = "unit" | "building" | "research";

type QueueTime = {
	start: Date;
	end: Date;
};

type QueueItem = {
	name: string;
	time: QueueTime;
	type: QueueItemType;
	onComplete: () => void;
	meta?: Record<string, any>; // ← optional data
};

export type { QueueItem };