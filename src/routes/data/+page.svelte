<script lang="ts">
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import type { PageServerData } from "./$types";
	import type { Character } from "$lib/server/db/schema";
	import { getRequest } from "$lib/utils/request";
	import { SaveController } from "$lib/controller/save.svelte";

	let { data }: { data: PageServerData } = $props();

	let characters: Character[] = $state([]);
	let flags: { name: string; value: boolean }[] = $state([]);

	type CharacterWithStats = Character & {
		stats: { name: string; value: number }[];
	};

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

		const allFlags = await getRequest<{ success: boolean; flags: { name: string; value: boolean }[] }>("/api/flag");
		console.log(allFlags);
		if (allFlags?.success) {
			flags = allFlags.flags;
		}
	});
</script>

<div class="wrapper mt-3 mx-5 px-3 py-3">
	<h1>Hi, {data.user.username}!</h1>
	<p>Your user ID is {data.user.id}.</p>
	<div class="my-5">
		<h2>Flags</h2>
		{#if flags.length > 0}
			<ul>
				{#each flags as flag}
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
				{#each characters as character}
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
