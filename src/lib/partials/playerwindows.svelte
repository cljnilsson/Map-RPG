<script lang="ts">
	import MapController from "$lib/controller/map.svelte";
	import UnitWindow from "$lib/features/window/windows/unit/unitWindow.svelte";
	import NavigationWindow from "$lib/features/window/windows/navigator/navigator.svelte";
	import LogWindow from "$lib/features/window/windows/logger/logger.svelte";
	import ResourceWindow from "$lib/features/window/windows/resources/resources.svelte";
	import EventWindow from "$lib/features/window/windows/events/events.svelte";
	import QuestWindow from "$lib/features/window/windows/quest/quest.svelte";
	import InventoryWindow from "$lib/features/window/windows/inventory/inventory.svelte";
	import { isCityMap } from "$lib/typeguards/map";
</script>

{#if isCityMap(MapController.currentMapState.map)}
	{#if MapController.currentMapState.map.city.owned}
		<UnitWindow />
		<ResourceWindow />
	{/if}
	<EventWindow />
{/if}
{#if MapController.currentMapState.contains.length > 0}
	<NavigationWindow />
{/if}
<InventoryWindow />
<QuestWindow />
<LogWindow />
