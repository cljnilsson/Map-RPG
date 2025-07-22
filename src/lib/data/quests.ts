import type { Quest } from "$lib/types/quest";

const questRegistry = {
	"test-quest-2": () => ({
		id: "test-quest-2",
		title: "Test Quest2",
		description: "This is a test quest description.",
		progressGoals: ["Talk to the NPC", "Complete the task"],
		progress: 0,
		rewardResources: [{ name: "Gold", amount: 3, icon: "/icons/coin3.png" }],
		rewardMisc: "",
		rewardItems: [],
		mainQuest: false,
		status: "active",
		dialogue: []
	})
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for (const [key, value] of Object.entries(questRegistry)) {
	if (key === value().id) {
		continue;
	} else {
		throw new Error(`Quest ID mismatch: key "${key}" does not match item ID "${value().id}"`);
	}
}

export type QuestId = keyof typeof questRegistry;

export function getQuest<T extends QuestId>(id: T) {
	return questRegistry[id]();
}
