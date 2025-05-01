type QueueTime = {
    start: Date;
    end: Date;
}

type QueueItem = {
    name: string;
    time: QueueTime;
    onComplete: () => void;
};

export type { QueueItem };