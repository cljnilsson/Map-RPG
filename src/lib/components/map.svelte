<script lang="ts">
	import WindowStore from "$lib/stores/windows.svelte";
	import MapClickBoxes from "$lib/partials/mapClickboxes.svelte";
	import MapStore from "$lib/stores/map.svelte";
	import QuestStore from "$lib/stores/quest.svelte";
	import MiniMenu from "$lib/features/miniMenu/miniMenu.svelte";
	import { onMount } from "svelte";
	import { isCityMap, isBuildingMap, isWorldMap } from "$lib/typeguards/map";
	import {isLootableQuestGameObject, isQuestGameObject} from "$lib/typeguards/gameObject";
	import type { NPC } from "$lib/types/npc";
	import type { Quest } from "$lib/types/quest";
	import type { GameObject } from "$lib/types/gameObject";
	import { isNPCQuestGiver, isNPCVendor } from "$lib/typeguards/npc";
	import VendorStore from "$lib/stores/vendor.svelte";
	import HoverOutlineImage from "$lib/outlineTest.svelte";
	import QuestController from "$lib/controller/quest.svelte";
	import { PlayerController } from "$lib/controller/character.svelte";

	let imgRef: HTMLImageElement;
	// Probably not ideal for future proofing but it works for now
	const originalWidth = 2560;
	const originalHeight = 1440;

	function scaleClickBoxes() {
		const currentWidth = window.screen.width;
		const currentHeight = window.screen.height;

		const scaleX = currentWidth / originalWidth;
		const scaleY = currentHeight / originalHeight;
		console.log(scaleX, scaleY);

		MapStore.currentMapState.contains.forEach((rect) => {
			rect.clickBox.x = rect.clickBox.originalX * scaleX;
			rect.clickBox.y = rect.clickBox.originalY * scaleY;
		});
	}

	onMount(() => {
		// For now the world view is not scaled thus this only works for the other views at the moment
		if (isCityMap(MapStore.currentMapState.map) || isBuildingMap(MapStore.currentMapState.map)) {
			scaleClickBoxes();
		}
	});

	function clickedOnNpc(npc: NPC) {
		console.log("NPC clicked", npc);

		if (isNPCVendor(npc)) {
			WindowStore.vendorVisibility = true;
			VendorStore.currentVendor = npc;
			console.log("Show the vendor!");
		} else if (isNPCQuestGiver(npc)) {
			const newQuest: Quest = {
				id: "2",
				title: "Test Quest 55",
				description: "This is a test quest description.",
				progressGoals: ["Talk to the NPC", "Complete the task"],
				progress: 0,
				rewardResources: [{ name: "Gold", amount: 3, icon: "/icons/coin3.png" }],
				rewardMisc: "",
				rewardItems: [],
				mainQuest: false,
				status: "active",
				dialogue: []
			};

			if (QuestStore.quests.filter((q) => q.id === newQuest.id).length > 0) {
				console.warn("Quest with this ID already exists, not adding again.");
				return;
			}

			QuestStore.quests = [...QuestStore.quests, newQuest];
		}
	}

	function clickedOnObject(o: GameObject) {
		console.log("Object clicked", o);

		if(isLootableQuestGameObject(o)) {
			if(o.quests.length > 0) {
				console.log("adding quest");
				QuestController.addQuest(o.quests[0]);
				if(isLootableQuestGameObject(o)) {
					console.log("Adding item");
					PlayerController.giveItem(o.pickedUpItem);
				}
			}
		} else if(isQuestGameObject(o)) {
			// Only support one quest for now.
			if(o.quests.length > 0) {
				console.log("adding quest");
				QuestController.addQuest(o.quests[0]);
			}
		}
	}
</script>

{#if MapStore.currentMapState}
	<div class="map-container">
		<img
			bind:this={imgRef}
			loading="lazy"
			src={MapStore.currentMapState.map?.imagePath}
			class:city={isCityMap(MapStore.currentMapState.map)}
			class:world={isWorldMap(MapStore.currentMapState.map)}
			class:building={isBuildingMap(MapStore.currentMapState.map)}
			alt="test"
			draggable="false"
		/>
		<MapClickBoxes />
		{#each MapStore.currentMapState.npcs as npc}
			<div
				role="button"
				tabindex="0"
				style="position: absolute; left: {npc.position.x}px; top: {npc.position.y}px;"
				on:click={() => clickedOnNpc(npc)}
				on:keydown={(e) => e.key === "Enter" && clickedOnNpc(npc)}
				aria-label={"Image of " + npc.name}
			>
				<h5 class="text-light text-center shadow">{npc.name}</h5>
				<HoverOutlineImage src={npc.img} alt={"Image of " + npc.name} width={150} />
			</div>
		{/each}
		{#each MapStore.currentMapState.objects as object}
			<div
				role="button"
				tabindex="0"
				style="position: absolute; left: {object.position.x}px; top: {object.position.y}px; width: 50px; height: 50px;"
				on:click={() => clickedOnObject(object)}
				on:keydown={(e) => e.key === "Enter" && clickedOnObject(object)}
				aria-label={"Image of " + object.name}
			>
				<HoverOutlineImage src={object.img} alt={"Image of " + object.name} width={100} />
			</div>
		{/each}
	</div>
	<MiniMenu />
{/if}

<style>
	.map-container {
		position: relative;
	}

	img {
		pointer-events: none;
		user-select: none;
		-webkit-user-select: none; /* for Safari */
	}
	img.city,
	img.building {
		height: 90vh;
		width: 100%;
		display: block;
	}
</style>
