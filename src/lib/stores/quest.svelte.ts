import type { Quest } from "$lib/types/quest";
import { getQuest } from "$lib/data/quests";

const Store = $state<{ quests: Quest[] }>({
	quests: [getQuest("test-quest-2"), getQuest("lost-ones")],
});

export default Store;