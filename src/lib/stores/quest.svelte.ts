import type { Quest } from "$lib/types/quest";

const testQuest: Quest = {
	id: "test-quest",
	title: "Test Quest",
	description: "This is a test quest to demonstrate the quest window.",
	rewardResources: [{ name: "gold", amount: 100, icon: "/items/potion1.jpg" }],
	rewardItems: [{ name: "Potion", amount: 1, icon: "/items/potion2.jpg", description: "A potion that restores 10 vitality." }],
	rewardMisc: "Access to the rest of the game!",
	dialogue: [
		{
			from: {
				name: "NPC",
				image: ""
			},
			type: "text",
			text: "Welcome to the test quest!"
		},
		{
			from: {
				name: "NPC",
				image: ""
			},
			type: "text",
			text: "What do I need to do?"
		},
		{
			from: {
				name: "NPC",
				image: ""
			},
			type: "text",
			text: "Just complete the quest and you'll be rewarded!"
		}
	],
	mainQuest: true,
	status: "active"
};

const Store = $state<{ quests: Quest[] }>({
	quests: [testQuest]
});

export default Store;
