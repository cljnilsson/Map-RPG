<script lang="ts">
	import MapStore from "$lib/stores/map.svelte";
	import { isLootableQuestGameObject, isQuestGameObject } from "$lib/typeguards/gameObject";
	import type { GameObject } from "$lib/types/gameObject";
	import HoverOutlineImage from "$lib/outlineTest.svelte";
	import QuestController from "$lib/controller/quest.svelte";
	import { PlayerController } from "$lib/controller/character.svelte";

	function clickedOnObject(o: GameObject) {
		console.log("Object clicked", o);

		if (isLootableQuestGameObject(o)) {
			if (o.quests.length > 0) {
				console.log("adding quest");
				QuestController.addQuest(o.quests[0]);
				if (isLootableQuestGameObject(o)) {
					console.log("Adding item");
					PlayerController.giveItem(o.pickedUpItem);
				}
			}
		} else if (isQuestGameObject(o)) {
			// Only support one quest for now.
			if (o.quests.length > 0) {
				console.log("adding quest");
				QuestController.addQuest(o.quests[0]);
			}
		}
	}
</script>

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
