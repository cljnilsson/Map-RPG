<script lang="ts">
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import type { PageServerData } from "./$types";
	import type { Character } from "$lib/server/db/schema";
	import { getRequest } from "$lib/utils/request";
	import { SaveController } from "$lib/controller/save.svelte";
	import { getFlags } from "$lib/test.remote";
	import CharacterStore from "$lib/stores/character.svelte";

	let { data }: { data: PageServerData } = $props();

	type CharacterWithStats = Character & {
		stats: { name: string; value: number }[];
	};

	let characters: CharacterWithStats[] = $state([]);
	let flags: { name: string; value: boolean }[] = $state([]);

	async function testToggle() {
		await fetch("/api/flag", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: "tutorialCompleted",
				value: true
			})
		});
	}

	async function onSave() {
		SaveController.saveCharacter(""); // code the argument later
	}

	onMount(async () => {
		const chars = await getRequest<{ success: boolean; characters: CharacterWithStats[] }>("/api/characters");

		console.log(chars);
		characters = [...chars.characters];
		if (characters.length > 0) {
			const character = characters[0];

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
					str: character.stats.filter(v => v.name === "Strength")[0].value,
					int: character.stats.filter(v => v.name === "Intelligence")[0].value,
					vit: character.stats.filter(v => v.name === "Vitality")[0].value,
					char: character.stats.filter(v => v.name === "Charisma")[0].value,
					dex: character.stats.filter(v => v.name === "Dexterity")[0].value
				},
				money: {
					gold: character.gold,
					silver: character.silver,
					copper: character.copper
				}
			};
		}

		const allFlags = await getFlags(data.user.id); // Experimental remote function
		console.log(allFlags);
	});
</script>

<div class="wrapper mt-3 mx-5 px-3 py-3">
	<h1>Hi, {data.user.username}!</h1>
	<p>Your user ID is {data.user.id}.</p>
	<div class="my-5">
		<h2>Flags</h2>
		{#if flags.length > 0}
			<ul>
				{#each flags as flag (flag.name)}
					<li>{flag.name}: {flag.value ? "true" : "false"}</li>
				{/each}
			</ul>
		{:else}
			<p>No flags found.</p>
		{/if}
	</div>
	<div class="my-5">
		<h2>Characters</h2>
		{#if characters.length > 0}
			<ul>
				{#each characters as character (character.id)}
					<li>{character.name} (ID: {character.id})</li>
				{/each}
			</ul>
		{:else}
			<p>No characters found.</p>
		{/if}
	</div>
	<button onclick={onSave}>Save current data</button>
	<button onclick={testToggle}>toggle tutorial flag</button>
	<form method="post" action="/api/logout" use:enhance>
		<button>Sign out</button>
	</form>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
