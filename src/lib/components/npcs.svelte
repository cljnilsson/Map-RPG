<script lang="ts">
	import { onMount } from "svelte";
	import MapStore from "$lib/stores/map.svelte";
	import type { NPC } from "$lib/types/npc";
	import HoverOutlineImage from "$lib/utils/outline.svelte";
	import { isNPCQuestGiver, isNPCVendor } from "$lib/typeguards/npc";
	import WindowStore from "$lib/stores/windows.svelte";
	import VendorStore from "$lib/stores/vendor.svelte";
	import QuestController from "$lib/controller/quest.svelte";

	const MAP_WIDTH = 2560;
	const MAP_HEIGHT = 1440;

	let scaleX = $state(1);
	let scaleY = $state(1);

	function updateScale() {
		scaleX = window.innerWidth / MAP_WIDTH;
		scaleY = window.innerHeight / MAP_HEIGHT;
	}

	onMount(() => {
		updateScale();
		window.addEventListener("resize", updateScale);
		return () => window.removeEventListener("resize", updateScale);
	});

	function clickedOnNpc(npc: NPC) {
		if (isNPCVendor(npc)) {
			WindowStore.vendorVisibility = true;
			VendorStore.currentVendor = npc;
		} else if (isNPCQuestGiver(npc) && npc.quests.length > 0) {
			QuestController.addQuest(npc.quests[0]);
		}
	}
</script>

{#each MapStore.currentMapState.npcs as npc}
	<div
		class="npc"
		style="left: {npc.position.x * scaleX}px; top: {npc.position.y * scaleY}px;"
		role="button"
		tabindex="0"
		onclick={() => clickedOnNpc(npc)}
		onkeydown={(e) => e.key === "Enter" && clickedOnNpc(npc)}
		aria-label={"Image of " + npc.name}
	>
		<h5 class="text-light text-center shadow">
			{npc.name}
			{#if isNPCQuestGiver(npc)}<i class="bi bi-exclamation"></i>{/if}
		</h5>
		<HoverOutlineImage src={npc.img} alt={"Image of " + npc.name} width={150} />
	</div>
{/each}

<style>
	.npc {
		position: absolute;
		transform: translate(-50%, -100%);
		cursor: pointer;
	}
	i {
		color: yellow;
	}
</style>
