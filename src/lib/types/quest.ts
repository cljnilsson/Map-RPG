import type { IsolatedMessage } from "$lib/types/message";

type Quest = {
    id: string;
    title: string;
    description: string;
    reward: string;
    Dialogue: IsolatedMessage[];
    mainQuest: boolean;
    status: "active" | "completed" | "failed";
};
export type { Quest };