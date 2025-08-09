//import type { Character } from "$lib/types/character";
import type { Quest } from "$lib/types/quest";
import QuestStore from "$lib/stores/quest.svelte";
import { LogController } from "$lib/controller/logs.svelte";

export default class QuestController {
	public static get quests() {
		return QuestStore.quests;
	}

	private static set quests(v: Quest[]) {
		QuestStore.quests = v;
	}

	public static addQuest(quest: Quest) {
		if (!this.quests.some((q) => q.id === quest.id)) {
			this.quests = [...this.quests, quest];
			LogController.newLog(`You have accepted the quest: ${quest.title}.`);
			return true;
		}
		return false;
	}
}
