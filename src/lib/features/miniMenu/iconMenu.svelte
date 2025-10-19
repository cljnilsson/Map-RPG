<script lang="ts">
	import WindowController from "$lib/controller/window.svelte";
	import DialogueController from "$lib/controller/dialogue.svelte";
	import MapController from "$lib/controller/map.svelte";
	import { isCityMap } from "$lib/typeguards/map";
	import Icon from "$lib/features/miniMenu/ui-icon.svelte";
	import type { WindowTypes } from "$lib/types/window";
	import ClickableElement from "$lib/components/utils/clickableElement.svelte";

	let expanded = $state(true);

	function toggleWindow(name: WindowTypes) {
		const win = WindowController.getByName(name);
		win.visible = !win.visible;
	}

	const menuItems: { iconPath: string; name: WindowTypes; label: string; cityOnly: boolean }[] = $derived([
		{ iconPath: "/items/note1.png", name: "Quests", label: "Quests", cityOnly: false},
		{ iconPath: "/items/bag3.png", name: "Inventory", label: "Inventory", cityOnly: false },
		{ iconPath: "/items/default.png", name: "Logger", label: "Logs", cityOnly: false },
		{ iconPath: "/items/map1.jpg", name: "Navigator", label: "Navigation", cityOnly: false },
		{ iconPath: "/items/note4.png", name: "Events", label: "Events", cityOnly: true },
		{ iconPath: "/items/helmet7.png", name: "UnitManagement", label: "Unit Management", cityOnly: true },
		{ iconPath: "/items/gem2.jpg", name: "Resources", label: "City Resources", cityOnly: true }
	]);

	function minimizeToggle() {
		expanded = !expanded;
	}
</script>

<div
	id="mini-menu"
	class="position-fixed bottom-0 end-0 m-3 rounded border shadow p-2 d-flex align-items-center"
	style="z-index: 1050;"
	class:d-none={DialogueController.inDialogue}
>
	{#if expanded}
		{#each menuItems as { iconPath, name, label, cityOnly } (name)}

			<Icon
				{iconPath}
				alt=""
				onClickCallback={() => toggleWindow(name)}
				disabled={cityOnly ? !isCityMap(MapController.currentMapState.map) : false}
				currentlyActive={WindowController.getByName(name).visible}
			>
				{#snippet tooltipHtml()}
					<h5 class="mb-0">{label}</h5>
				{/snippet}
			</Icon>
		{/each}
	{/if}

	<!-- toggle button always visible -->
	<div class="ms-2">
		<ClickableElement onClickCallback={minimizeToggle}>
			<i class="bi" class:bi-arrow-bar-right={expanded} class:bi-arrow-bar-left={!expanded}></i>
		</ClickableElement>
	</div>
</div>

<style>
	#mini-menu {
		backdrop-filter: blur(20px);
		background-color: rgba(255, 255, 255, 0.5);
	}

	i {
		font-size: 44px;
	}
</style>
