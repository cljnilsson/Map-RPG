<script lang="ts">
	import { enhance } from "$app/forms";
	import { onMount } from "svelte";
	import type { PageServerData } from "./$types";
	import type { Character } from "$lib/server/db/schema";
	import { getRequest } from "$lib/utils/request";

	let { data }: { data: PageServerData } = $props();

	let characters: Character[] = $state([]);

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

	onMount(async () => {
		const chars = await getRequest<{ success: boolean; characters: CharacterWithStats[] }>(
			"/api/characters"
		);

		console.log(chars);
		characters = [...chars.characters];
	});
</script>

<div class="wrapper mt-3 mx-5 px-3 py-3">
	<h1>Hi, {data.user.username}!</h1>
	<p>Your user ID is {data.user.id}.</p>
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
