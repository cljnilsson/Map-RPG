<script lang="ts">
	import MapController from "$lib/controller/map.svelte";
	import UnitWindow from "$lib/components/windows/unit/unitWindow.svelte";
	import NavigationWindow from "$lib/components/windows/navigator/navigator.svelte";
	import LogWindow from "$lib/components/windows/logger/logger.svelte";
	import ResourceWindow from "$lib/components/windows/resources/resources.svelte";
	import EventWindow from "$lib/components/windows/events/events.svelte";
	import QuestWindow from "$lib/components/windows/quest/quest.svelte";
	import InventoryWindow from "$lib/components/windows/inventory/inventory.svelte";
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
