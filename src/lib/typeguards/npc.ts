import type { NPC, VendorNPC, QuestGiverNPC } from "$lib/types/npc";

function isCityMap(npc: NPC): npc is VendorNPC {
	return "items" in npc;
}

function isBuildingMap(npc: NPC): npc is QuestGiverNPC {
	return "quests" in npc;
}

export { isCityMap, isBuildingMap };
