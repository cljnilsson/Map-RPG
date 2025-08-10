//import type { Character } from "$lib/types/character";
import type { Quest } from "$lib/types/quest";
import QuestStore from "$lib/stores/quest.svelte";
import { LogController } from "$lib/controller/logs.svelte";
import { SaveController } from "$lib/controller/save.svelte";

export default class QuestController {
	public static get quests() {
		return QuestStore.quests;
	}

	private static set quests(v: Quest[]) {
		QuestStore.quests = v;
	}

	public static addQuest(quest: Quest) {
		if (!this.hasQuest(quest)) {
			this.quests = [...this.quests, quest];
			LogController.newLog(`You have accepted the quest: ${quest.title}.`);
			SaveController.saveQuests();
			return true;
		}
		return false;
	}

	public static hasQuest(quest: Quest): boolean {
		return !this.quests.some((q) => q.id === quest.id);
	}
}
