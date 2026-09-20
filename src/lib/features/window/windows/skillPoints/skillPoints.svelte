<script lang="ts">
	import Window from "#lib/features/window/window.svelte";
	import WindowController from "#lib/controller/window.svelte.js";
	import { PlayerController } from "#lib/controller/character.svelte.js";
	import CreatorStat from "#lib/features/creator/creatorStat.svelte";
	import type { Character } from "#lib/types/character.js";
	import { untrack } from "svelte";

	const skillWindow = WindowController.getByName("SkillPoints");
	const labels = { str: "Strength", dex: "Dexterity", int: "Intelligence", vit: "Vitality", char: "Charisma" };
	const keys = Object.keys(labels) as (keyof Character["stats"])[];
	let baseline = $state<Character["stats"]>({ str: 0, dex: 0, int: 0, vit: 0, char: 0 });
	let draft = $state<Character["stats"]>({ str: 0, dex: 0, int: 0, vit: 0, char: 0 });
	let available = $state(0);
	let saving = $state(false);
	let error = $state("");
	const spent = $derived(keys.reduce((sum, key) => sum + draft[key] - baseline[key], 0));
	const remaining = $derived(available - spent);

	$effect(() => {
		if (skillWindow.visible) {
			untrack(() => {
				baseline = { ...PlayerController.stats };
				draft = { ...baseline };
				available = PlayerController.unspentSkillPoints;
				error = "";
			});
		}
	});

	async function save() {
		if (saving || spent <= 0 || remaining < 0) return;
		saving = true;
		error = "";
		const allocation = { ...draft };
		for (const key of keys) allocation[key] -= baseline[key];
		try {
			await PlayerController.allocateSkillPoints(allocation);
			skillWindow.visible = false;
		} catch {
			error = "Could not save skill points. Reload to check your balance, then try again.";
		} finally {
			saving = false;
		}
	}
</script>

<Window uniqueKey="SkillPoints" width={440} height={370} x={skillWindow.x} y={skillWindow.y} bind:visibility={skillWindow.visible} canClose={!saving}>
	{#snippet title()}
		<h4 class="my-2">Skill points</h4>
	{/snippet}
	{#snippet body()}
		<p aria-live="polite">Points remaining: <strong>{remaining}</strong></p>
		<fieldset disabled={saving}>
			<legend class="visually-hidden">Allocate skill points</legend>
			{#each keys as key (key)}
				<CreatorStat size="sm" darkMode name={labels[key]} min={baseline[key]} max={baseline[key] + available} total={spent} totalMax={available} totalLeft={remaining} bind:stat={draft[key]} />
			{/each}
			<button type="button" class="btn btn-primary mt-2" disabled={spent <= 0 || remaining < 0} onclick={save}>{saving ? "Saving…" : "Save points"}</button>
		</fieldset>
		{#if error}<p class="text-danger mt-2" role="alert">{error}</p>{/if}
	{/snippet}
</Window>
