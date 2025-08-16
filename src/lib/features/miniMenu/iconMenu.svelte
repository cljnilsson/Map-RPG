<script lang="ts">
	import DialogueStore from "$lib/stores/dialogue.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import MapController from "$lib/controller/map.svelte";
	import { isCityMap } from "$lib/typeguards/map";
	import Icon from "$lib/features/miniMenu/ui-icon.svelte";

	let isCurrentCityMap = $derived(isCityMap(MapController.currentMapState.map));
</script>

<div
	id="mini-menu"
	class="position-fixed bottom-0 end-0 m-3 rounded border shadow p-2"
	style="z-index: 1050;"
	class:d-none={DialogueStore.inDialogue}
>
	<Icon
		iconPath="/items/note1.png"
		alt=""
		onClickCallback={() => (WindowStore.quest.visible = !WindowStore.quest.visible)}
		disabled={false}
	>
		{#snippet tooltipHtml()}
			<h5 class="mb-0">Quests</h5>
		{/snippet}
	</Icon>
	<Icon
		iconPath="/items/bag3.png"
		alt=""
		onClickCallback={() => (WindowStore.inventory.visible = !WindowStore.inventory.visible)}
		disabled={false}
	>
		{#snippet tooltipHtml()}
			<h5 class="mb-0">Inventory</h5>
		{/snippet}
	</Icon>
	<Icon
		iconPath="/items/default.png"
		alt=""
		onClickCallback={() => (WindowStore.logger.visible = !WindowStore.logger.visible)}
		disabled={false}
	>
		{#snippet tooltipHtml()}
			<h5 class="mb-0">Logs</h5>
		{/snippet}
	</Icon>
	<Icon
		iconPath="/items/map1.jpg"
		alt=""
		onClickCallback={() => (WindowStore.navigation.visible = !WindowStore.navigation.visible)}
		disabled={false}
	>
		{#snippet tooltipHtml()}
			<h5 class="mb-0">Navigation</h5>
		{/snippet}
	</Icon>
	<Icon
		iconPath="/items/note4.png"
		alt=""
		onClickCallback={() => (WindowStore.events.visible = !WindowStore.events.visible)}
		disabled={!isCurrentCityMap}
	>
		{#snippet tooltipHtml()}
			<h5 class="mb-0">Events</h5>
		{/snippet}
	</Icon>
	<Icon
		iconPath="/items/helmet7.png"
		alt=""
		onClickCallback={() => (WindowStore.unit.visible = !WindowStore.unit.visible)}
		disabled={!isCurrentCityMap}
	>
		{#snippet tooltipHtml()}
			<h5 class="mb-0">Unit Management</h5>
		{/snippet}
	</Icon>
	<Icon
		iconPath="/items/gem2.jpg"
		alt=""
		onClickCallback={() => (WindowStore.resources.visible = !WindowStore.resources.visible)}
		disabled={!isCurrentCityMap}
	>
		{#snippet tooltipHtml()}
			<h5 class="mb-0">City Resources</h5>
		{/snippet}
	</Icon>
</div>

<style>
	#mini-menu {
		backdrop-filter: blur(20px);
		background-color: rgba(255, 255, 255, 0.5);
	}
</style>
