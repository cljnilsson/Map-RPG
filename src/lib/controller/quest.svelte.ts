//import type { Character } from "$lib/types/character";
import type { Quest } from "$lib/types/quest";
import QuestStore from "$lib/stores/quest.svelte";
import LogStore from "$lib/stores/logs.svelte";

export default class QuestController {
	public static addQuest(quest: Quest) {
		if (!QuestStore.quests.some((q) => q.id === quest.id)) {
			QuestStore.quests = [...QuestStore.quests, quest];
			LogStore.logs = [
				...LogStore.logs,
				{
					timestamp: new Date(),
					message: `You have accepted the quest: ${quest.title}.`,
					type: "info"
				}
			];
			return true;
		}
		return false;
	}
}
