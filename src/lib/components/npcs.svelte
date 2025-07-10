<script lang="ts">
	import WindowStore from "$lib/stores/windows.svelte";
	import MapStore from "$lib/stores/map.svelte";
	import type { NPC } from "$lib/types/npc";
	import QuestController from "$lib/controller/quest.svelte";
	import { isNPCQuestGiver, isNPCVendor } from "$lib/typeguards/npc";
	import VendorStore from "$lib/stores/vendor.svelte";
	import HoverOutlineImage from "$lib/outlineTest.svelte";

	function clickedOnNpc(npc: NPC) {
		console.log("NPC clicked", npc);

		if (isNPCVendor(npc)) {
			WindowStore.vendorVisibility = true;
			VendorStore.currentVendor = npc;
			console.log("Show the vendor!");
		} else if (isNPCQuestGiver(npc)) {
			if(npc.quests.length > 0) {
				console.log("adding quest");
				QuestController.addQuest(npc.quests[0]);
			}
		}
	}
</script>

{#each MapStore.currentMapState.npcs as npc}
	<div
		role="button"
		tabindex="0"
		style="position: absolute; left: {npc.position.x}px; top: {npc.position.y}px;"
		on:click={() => clickedOnNpc(npc)}
		on:keydown={(e) => e.key === "Enter" && clickedOnNpc(npc)}
		aria-label={"Image of " + npc.name}
	>
		<h5 class="text-light text-center shadow">{npc.name} {#if isNPCQuestGiver(npc)}<i class="bi bi-exclamation"></i>{/if}</h5>
		<HoverOutlineImage src={npc.img} alt={"Image of " + npc.name} width={150} />
	</div>
{/each}

<style>
	i {
		color: yellow;
	}
</style>