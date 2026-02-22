import type { NPC, VendorNPC, QuestGiverNPC } from "$lib/types/npc";

function isNPCVendor(npc: NPC): npc is VendorNPC {
	return "items" in npc;
}

function isNPCQuestGiver(npc: NPC): npc is QuestGiverNPC {
	return "quests" in npc;
}

export { isNPCQuestGiver, isNPCVendor };