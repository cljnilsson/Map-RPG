<script lang="ts">
	import CharacterStore from "$lib/stores/character.svelte";

	//import "bootstrap/dist/css/bootstrap.min.css";
	//import scriptSrc from "bootstrap/dist/js/bootstrap.bundle.js?url";
	//import "bootstrap-icons/font/bootstrap-icons.css";

	import "./styles.scss";
	import "animate.css";
	import Nav from "$lib/partials/nav.svelte";
	import { onMount, type Snippet } from "svelte";
	import type { LayoutData } from "$lib/types/layoutData";
	import Tutorial from "$lib/game/tutorial.svelte";
	import Notification from "$lib/features/notification/notification.svelte";
	import { getItem } from "$lib/data/items";
	import { getRequest } from "$lib/utils/request";
	import { getCityResources } from "$lib/utils/resources";
	import type { Character } from "$lib/server/db/schema";
	import { source } from "sveltekit-sse";

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

	let tutorialCompleted = true; //$state(getFlagByName("tutorialCompleted"));
	type CharacterWithStats = Character & {
		stats: { name: string; value: number }[];
	};

	async function loadCharacter() {
		const chars = await getRequest<{ success: boolean; characters: CharacterWithStats[] }>("/api/characters");

		if (chars.characters.length > 0) {
			const character = chars.characters[0];

			CharacterStore.character = {
				id: character.id,
				name: character.name,
				health: character.health,
				maxHealth: character.maxHealth,
				age: character.age,
				gender: character.gender,
				race: character.race,
				conditions: [],
				xp: character.xp,
				level: character.level,
				stats: {
					str: character.stats.filter((v) => v.name === "Strength")[0].value,
					int: character.stats.filter((v) => v.name === "Intelligence")[0].value,
					vit: character.stats.filter((v) => v.name === "Vitality")[0].value,
					char: character.stats.filter((v) => v.name === "Charisma")[0].value,
					dex: character.stats.filter((v) => v.name === "Dexterity")[0].value
				},
				money: {
					gold: character.gold,
					silver: character.silver,
					copper: character.copper
				}
			};
		}
	}

	type serverPing = {
		cityId: number;
		name: string;
		resource: string;
		value: number;
	};

	onMount(() => {
		const hr = source("/api/resources");
		const json = hr.select("message").json<{ timpStamp: Date; data: serverPing[] }>((or) => {
			console.log("new ping");
			if (!or.raw) {
				// nothing in the event → keep previous value
				return or.previous;
			}

			try {
				return JSON.parse(or.raw);
			} catch (err) {
				console.error(`Could not parse "${or.raw}" as json.`, err);
				return or.previous;
			}
		});

		json.subscribe((message) => {
			if (!message || !message.data) return;
			console.log("Got the ping");
			if (message.data) {
				console.log(message.data);
				getCityResources(message.data);
			}
		});

		loadCharacter();

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
	});
</script>

<svelte:head>
	<!-- <script src={scriptSrc} defer></script> -->
	<link rel="icon" type="image/svg" href="/facicon.png" />
	<title>Travian x DnD</title>
	<meta name="description" content="A SPA-ish web game based on both Travian and DnD." />
	<link rel="stylesheet" href="/bootstrap/bootstrap.min.css">
	<link rel="stylesheet" href="/bootstrap/bootstrap-icons.min.css">
	<script src="/bootstrap/bootstrap.bundle.min.js" defer></script>
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
		background-image: url("/bg.webp");
		background-size: cover;
		background-repeat: repeat-y;
	}
</style>
