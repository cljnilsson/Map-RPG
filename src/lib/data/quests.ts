import type { Quest } from "$lib/types/quest";

const questRegistry = {
	"test-quest-2": () =>
		({
			id: "test-quest-2",
			title: "Test Quest",
			description: "This is a test quest to demonstrate the quest window.",
			rewardResources: [{ name: "Copper", amount: 100, icon: "/items/coin1.jpg" }],
			rewardItems: [
				{ name: "Potion", amount: 1, icon: "/items/potion2.jpg", description: "A potion that restores 10 vitality." },
			],
			rewardMisc: "Access to the rest of the game!",
			progress: 1,
			progressGoals: ["Start the quest", "Complete the quest"],
			dialogue: [
				{
					from: {
						name: "NPC",
						image: "",
					},
					type: "text",
					text: "Welcome to the test quest!",
				},
				{
					from: {
						name: "NPC",
						image: "",
					},
					type: "text",
					text: "What do I need to do?",
				},
				{
					from: {
						name: "NPC",
						image: "",
					},
					type: "text",
					text: "Just complete the quest and you'll be rewarded!",
				},
			],
			mainQuest: true,
			status: "active",
		}) as Quest,
	"lost-ones": () =>
		({
			id: "lost-ones",
			title: "Lost ones",
			description:
				"A group of local children have gone missing, any clues of their whereabouts will be rewarded. Last seen two days ago. Contact Captain Brenoff for further information or to enroll in the formal search efforts.",
			rewardResources: [{ name: "Copper", amount: 10, icon: "/items/coin2.jpg" }],
			rewardItems: [],
			rewardMisc: "",
			progress: 1,
			progressGoals: [
				"Start the quest",
				"Talk to Captain Brenoff",
				"Talk to Talk with Julia's parents",
				"Talk to Talk with Oliver's parents",
				"Talk to Talk with Robert's parents",
			],
			dialogue: [],
			mainQuest: false,
			status: "active",
		}) as Quest,
} as const;

// Somewhat ugly solution to ensure match but it'll do for now, ideally I want this to be done automatically without losing key safety
for (const [key, value] of Object.entries(questRegistry)) {
	if (key === value().id) {
	} else {
		throw new Error(`Quest ID mismatch: key "${key}" does not match item ID "${value().id}"`);
	}
}

export type QuestId = keyof typeof questRegistry;

export function getQuest<T extends QuestId>(id: T): Quest {
	return questRegistry[id]();
}

export function getAllQuests(): Quest[] {
	const quests: Quest[] = [];

	for (const quest of Object.values(questRegistry)) {
		quests.push(quest());
	}

	return quests;
}