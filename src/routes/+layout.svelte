<script lang="ts">
	import CharacterStore from "$lib/stores/character.svelte";
	import "bootstrap/dist/css/bootstrap.min.css";
	import scriptSrc from "bootstrap/dist/js/bootstrap.bundle.js?url";
	import "bootstrap-icons/font/bootstrap-icons.css";
	import "./styles.scss";
	import "animate.css";
	import Nav from "$lib/partials/nav.svelte";
	import { onMount, type Snippet } from "svelte";
	import type { LayoutData } from "$lib/types/layoutData";
	import Tutorial from "$lib/game/tutorial.svelte";
	import Notification from "$lib/features/notification/notification.svelte";
	import { getItem } from "$lib/data/items";
	import { startResourceTimer, stopResourceTimer } from "$lib/utils/resources";

	let { children, data }: { children: Snippet<[]>; data: LayoutData } = $props();

	let flags: { name: string; value: boolean }[] = $derived(
		data?.userFlags.map((flag: { name: string; value: number }) => ({
			name: flag.name,
			value: flag.value === 1
		})) ?? []
	);

	function getFlagByName(name: string): boolean | undefined {
		return flags.find((flag) => flag.name === name)?.value;
	}

	let tutorialCompleted = false; //$state(getFlagByName("tutorialCompleted"));

	onMount(() => {
		// Will load from DB eventually
		if (CharacterStore.inventory.length === 0) {
			CharacterStore.inventory = [
				// Throwaway testing items
				{ item: getItem("test-item-1"), amount: 1 },
				{ item: getItem("test-item-2"), amount: 1 },
				{ item: getItem("test-item-3"), amount: 3 },
				// 'real' items
				{ item: getItem("health-potion"), amount: 3 },
				{ item: getItem("old-book"), amount: 1 }
			];
		}
		startResourceTimer();
		return stopResourceTimer;
	});
</script>

<svelte:head>
	<link rel="icon" type="image/svg" href="/facicon.png" />
	<script src={scriptSrc}></script>
</svelte:head>

<div class="container-fluid p-0">
	<Nav {data}></Nav>
	{#if !tutorialCompleted}
		<Tutorial />
	{:else}
		<Notification />
	{/if}
	{@render children()}
</div>

<style>
	.container-fluid {
		min-height: 100%;
		background-image: url("/bg.jpg");
		background-size: cover;
		background-repeat: repeat-y;
	}
</style>
