import type { IsolatedMessage } from "$lib/types/message";

type Quest = {
    id: string;
    title: string;
    description: string;
    rewardResources: {name: string, amount: number, icon: string}[];
    rewardItems: {name: string, amount: number, icon: string, description: string}[];
    rewardMisc: string;
    dialogue: IsolatedMessage[];
    mainQuest: boolean;
    status: "active" | "completed" | "failed";
};
export type { Quest };