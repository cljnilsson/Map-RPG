import type { Message } from "$lib/types/message";

type Quest = {
    id: string;
    title: string;
    description: string;
    reward: string;
    Dialogue: Message[];
    mainQuest: boolean;
    status: "active" | "completed" | "failed";
};
export type { Quest };