import type { Quest } from "#lib/types/quest.js";
import QuestStore from "#lib/stores/quest.svelte.js";
import LogController from "#lib/controller/logs.svelte.js";
import SaveController from "#lib/controller/save.svelte.js";

class QuestController {
	public get quests() {
		return QuestStore.quests;
	}

	private set quests(v: Quest[]) {
		QuestStore.quests = v;
	}

	public addQuest(quest: Quest) {
		if (!this.hasQuest(quest)) {
			this.quests = [...this.quests, quest];
			LogController.newLogSimple(`You have accepted the quest: ${quest.title}.`);
			SaveController.saveQuests();
			return true;
		}
		return false;
	}

	public removeQuest(quest: Quest) {
		if (this.hasQuest(quest)) {
			this.quests = this.quests.filter((q) => q.id !== quest.id);
			LogController.newLogSimple(`You have forfeit the quest: ${quest.title}.`);
			SaveController.saveQuests();
			return true;
		}
		return false;
	}

	public hasQuest(quest: Quest): boolean {
		return this.quests.some((q) => q.id === quest.id);
	}
}

const instance = new QuestController();

export default instance;