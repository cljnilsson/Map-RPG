<script lang="ts">
import ContainerStore from "$lib/stores/container.svelte";
import { onMount } from "svelte";
import MapController from "$lib/controller/map.svelte";
import WindowController from "$lib/controller/window.svelte";
import {
	isContainerGameObject,
	isLootableQuestGameObject,
	isQuestGameObject,
	isLootableGameObject,
} from "$lib/typeguards/gameObject";
import type { GameObject } from "$lib/types/gameObject";
import HoverOutlineImage from "$lib/utils/outline/hoverOutline.svelte";
import QuestController from "$lib/controller/quest.svelte";
import { PlayerController } from "$lib/controller/character.svelte";
import LogController from "$lib/controller/logs.svelte";
import Tooltip from "$lib/features/tooltip/tooltipOnClick.svelte";

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

	/*
	if (isLootableQuestGameObject(o)) {
		if (o.quests.length > 0) {
			console.log("adding quest");
			QuestController.addQuest(o.quests[0]);
			console.log("Adding item");
			PlayerController.giveItem(o.pickedUpItem.item);
		}
	} else if (isQuestGameObject(o) && o.quests.length > 0) {
		QuestController.addQuest(o.quests[0]);
	} else if (isContainerGameObject(o)) {
		if (o.requiredItems.length > 0 && !PlayerController.hasItems(o.requiredItems)) {
			LogController.newLog("You do not have the required items to open this container.");
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
	*/
}

function menuClickOption(option: string, cb: (() => undefined) | null) {
	console.log("Clicked on menu item: ", option);
}

let tempHardcoded: { text: string; cb: (() => undefined) | null }[] = [
	{ text: "Item 1", cb: null },
	{ text: "Item 2", cb: null },
	{ text: "Item 3", cb: null },
	{ text: "Item 4", cb: null },
	{ text: "Item 5", cb: null },
];
</script>

{#each MapController.currentMapState.objects as object, index (index)}
	<div
		class="game-object"
		style="left: {object.position.x * scaleX}px; top: {object.position.y * scaleY}px;"
		role="button"
		tabindex="0"
		onclick={() => clickedOnObject(object)}
		onkeydown={(e) => e.key === "Enter" && clickedOnObject(object)}
		aria-label={"Image of " + object.name}
	>
    	<Tooltip>
         {#snippet onClickTooltip()}
           	<ul class="rs-menu list-group">
          		{#each tempHardcoded as temp}
         			<li class="list-group-item p-0">
            				<button
           					type="button"
           					class="rs-menu-button"
           					onclick={() => menuClickOption(temp.text, temp.cb)}
            				>
           					{temp.text}
            				</button>
         			</li>
          		{/each}
           	</ul>
         {/snippet}
            <HoverOutlineImage src={object.img} alt={"Image of " + object.name} width={100} />
    	</Tooltip>
	</div>
{/each}

<style lang="scss">
	.game-object {
		position: absolute;
		transform: translate(-50%, -100%);
		width: 50px;
		height: 50px;
		cursor: pointer;
	}

	ul {
	    pointer-events: auto !important;
	}

	.rs-menu {
		padding: 0;
		margin: 0;
		list-style: none;
		background: #e3c9b2;
	}

    .rs-menu .list-group-item {
    	background: transparent;
    	border: none;
    	padding: 0;
    }

    .rs-menu-button {
    	width: 100%;
    	border: none;
    	background: transparent;
    	padding: 4px 8px;
    	font-size: 14px;
    	text-align: left;
    	cursor: pointer;
    	color: rgb(119, 96, 84);
    }

    .rs-menu-button:hover {
    	background: #d2b8a0;
    }

    .rs-menu-button:focus {
    	outline: none;
    	background: #d2b8a0;
    }
</style>
