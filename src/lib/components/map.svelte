<script lang="ts">
	import MapClickBoxes from "$lib/partials/mapClickboxes.svelte";
	import MapStore from "$lib/stores/map.svelte";
	import QuestStore from "$lib/stores/quest.svelte";
	import MiniMenu from "$lib/features/miniMenu/miniMenu.svelte";
	import { onMount } from "svelte";
	import { isCityMap, isBuildingMap, isWorldMap } from "$lib/typeguards/map";
	import type { NPC } from "$lib/types/npc";
	import type {Quest} from "$lib/types/quest";

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

		const newQuest: Quest = {
			id: "2",
			title: "Test Quest2",
			description: "This is a test quest description.",
			progressGoals: ["Talk to the NPC", "Complete the task"],
			progress: 0,
			rewardResources: [
				{ name: "Gold", amount: 3, icon: "/icons/coin3.png" },
			],
			rewardMisc: "",
			rewardItems: [],
			mainQuest: false,
			status: "active",
			dialogue: []

		}

		if(QuestStore.quests.filter(q => q.id === newQuest.id).length > 0) {
			console.warn("Quest with this ID already exists, not adding again.");
			return;
		}

		QuestStore.quests = [...QuestStore.quests, newQuest];
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
		<MapClickBoxes></MapClickBoxes>
		{#each MapStore.currentMapState.npcs as npc}
			<button
				style="position: absolute; left: {npc.position.x}px; top: {npc.position.y}px; width: 50px; height: 50px;"
				on:click={() => clickedOnNpc(npc)}
				on:keydown={(e) => e.key === "Enter" && clickedOnNpc(npc)}
				aria-label={"Image of " + npc.name}
			>
				<img src={npc.img} alt={"Image of " + npc.name} style="width: 100%; height: 100%;" />
			</button>
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
