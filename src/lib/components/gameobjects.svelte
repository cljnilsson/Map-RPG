<script lang="ts">
	import ContainerStore from "$lib/stores/container.svelte";
	import { onMount } from "svelte";
	import MapController from "$lib/controller/map.svelte";
	import WindowController from "$lib/controller/window.svelte";
	import { isContainerGameObject, isLootableQuestGameObject, isQuestGameObject, isLootableGameObject } from "$lib/typeguards/gameObject";
	import type { GameObject } from "$lib/types/gameObject";
	import HoverOutlineImage from "$lib/utils/outline.svelte";
	import QuestController from "$lib/controller/quest.svelte";
	import { PlayerController } from "$lib/controller/character.svelte";

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

	function clickedOnObject(o: GameObject) {
		console.log("Object clicked", o);

		if (isLootableQuestGameObject(o)) {
			if (o.quests.length > 0) {
				console.log("adding quest");
				QuestController.addQuest(o.quests[0]);
				console.log("Adding item");
				PlayerController.giveItem(o.pickedUpItem.item);
			}
		} else if (isQuestGameObject(o) && o.quests.length > 0) {
			console.log("adding quest");
			QuestController.addQuest(o.quests[0]);
		} else if (isContainerGameObject(o)) {
			if (o.requiredItems.length > 0 && !PlayerController.hasItems(o.requiredItems)) {
				console.log("You do not have the required items to open this container.");
				return;
			}

			console.log("Opening container", o);
			if (o.contains.length > 0) {
				WindowController.getByName("Container").visible = true;
				ContainerStore.object = o;
			}
		} else if (isLootableGameObject(o)) {
			console.log("Adding item");
			PlayerController.giveItem(o.pickedUpItem.item);
		}
	}
</script>

{#each MapController.currentMapState.objects as object}
	<div
		class="game-object"
		style="left: {object.position.x * scaleX}px; top: {object.position.y * scaleY}px;"
		role="button"
		tabindex="0"
		onclick={() => clickedOnObject(object)}
		onkeydown={(e) => e.key === "Enter" && clickedOnObject(object)}
		aria-label={"Image of " + object.name}
	>
		<HoverOutlineImage src={object.img} alt={"Image of " + object.name} width={100} />
	</div>
{/each}

<style>
	.game-object {
		position: absolute;
		transform: translate(-50%, -100%);
		width: 50px;
		height: 50px;
		cursor: pointer;
	}
</style>
