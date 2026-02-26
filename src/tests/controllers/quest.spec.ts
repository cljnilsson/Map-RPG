import { describe, it, expect, vi, beforeEach } from "vitest";
import QuestController from "$lib/controller/quest.svelte";
import type { Quest } from "$lib/types/quest";

// Mock QuestStore
vi.mock("$lib/stores/quest.svelte", () => {
	return {
		default: {
			quests: [] as Quest[],
		},
	};
});

// Mock LogController
vi.mock("$lib/controller/logs.svelte", () => {
	return {
		default: {
			newLogSimple: vi.fn(),
		},
	};
});

// Mock SaveController
vi.mock("$lib/controller/save.svelte", () => {
	return {
		SaveController: {
			saveQuests: vi.fn(),
		},
	};
});

import QuestStore from "$lib/stores/quest.svelte";
import LogController from "$lib/controller/logs.svelte";
import { SaveController } from "$lib/controller/save.svelte";

describe("QuestController", () => {
	const sampleQuest: Quest = {
		id: "1",
		title: "Find the Sword",
		description: "Retrieve the legendary sword from the cave.",
		progress: 0,
		progressGoals: ["Enter the cave", "Defeat the guardian", "Collect the sword"],
		rewardResources: [{ name: "Gold", amount: 100, icon: "gold.png" }],
		rewardItems: [
			{
				name: "Health Potion",
				amount: 2,
				icon: "potion.png",
				description: "Restores 50 HP",
			},
		],
		rewardMisc: "Hero reputation increased",
		dialogue: [], // can be left empty for tests
		mainQuest: true,
		status: "active",
	};

	beforeEach(() => {
		// Reset store and mocks before each test
		QuestStore.quests = [];
		vi.clearAllMocks();
	});

	it("should add a quest if it doesn't exist", () => {
		const added = QuestController.addQuest(sampleQuest);

		expect(added).toBe(true);
		expect(QuestStore.quests).toContainEqual(sampleQuest);
		expect(LogController.newLogSimple).toHaveBeenCalledWith("You have accepted the quest: Find the Sword.");
		expect(SaveController.saveQuests).toHaveBeenCalled();
	});

	it("should not add a quest if it already exists", () => {
		QuestStore.quests = [sampleQuest];

		const added = QuestController.addQuest(sampleQuest);

		expect(added).toBe(false);
		expect(QuestStore.quests.length).toBe(1);
		expect(LogController.newLogSimple).not.toHaveBeenCalled();
		expect(SaveController.saveQuests).not.toHaveBeenCalled();
	});

	it("should remove a quest if it exists", () => {
		QuestStore.quests = [sampleQuest];

		const removed = QuestController.removeQuest(sampleQuest);

		expect(removed).toBe(true);
		expect(QuestStore.quests).not.toContainEqual(sampleQuest);
		expect(LogController.newLogSimple).toHaveBeenCalledWith("You have forfeit the quest: Find the Sword.");
		expect(SaveController.saveQuests).toHaveBeenCalled();
	});

	it("should not remove a quest if it does not exist", () => {
		const removed = QuestController.removeQuest(sampleQuest);

		expect(removed).toBe(false);
		expect(QuestStore.quests.length).toBe(0);
		expect(LogController.newLogSimple).not.toHaveBeenCalled();
		expect(SaveController.saveQuests).not.toHaveBeenCalled();
	});

	it("should check if a quest exists", () => {
		QuestStore.quests = [sampleQuest];

		expect(QuestController.hasQuest(sampleQuest)).toBe(true);
		expect(
			QuestController.hasQuest({
				...sampleQuest,
				id: "2",
				title: "Other Quest",
			}),
		).toBe(false);
	});
});