<script lang="ts">
	import type { Snippet } from "svelte";
	import Die from "$lib/features/die/die.svelte";

	let {
		num,
		sides,
		modifier,
		clickable,
		children
	}: {
		num: number;
		sides: number;
		modifier: number;
		clickable: boolean;
		children?: Snippet<[]>;
	} = $props();

	let die: Die[] = [];
	let latestRollResult: number = $state(-1);
	let grow: boolean = $state(false);

	export async function roll(): Promise<number[]> {
		const results = await Promise.all(die.map((d) => d.roll()));

		setTimeout(() => {
			latestRollResult = results.reduce((newValue, currentValues) => currentValues + newValue);
			grow = true;
		}, 1000);

		setTimeout(() => {
			grow = false;
		}, 1500);

		return results;
	}
</script>

<div>
	{#if children}
		<div>
			{@render children()}
		</div>
	{/if}
	<div class="row justify-content-center">
		{#each { length: num }, i (i)}
			<div class="col-auto">
				<Die {sides} {clickable} bind:this={die[i]} />
			</div>
		{/each}
	</div>
	<div class="row justify-content-center my-5">
		<div class="col-auto text-center">
			<h2 style="min-height: 1em; opacity: {latestRollResult > 0 ? 1 : 0}">
				({latestRollResult > 0 ? latestRollResult : 0} + {modifier})
			</h2>
			<h2 class:grow-shrink={grow} style="min-height: 1em; opacity: {latestRollResult > 0 ? 1 : 0}">
				{latestRollResult > 0 ? latestRollResult + modifier : 0}
			</h2>
		</div>
	</div>
</div>

<style>
	@keyframes growAndShrink {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(2);
		}
		100% {
			transform: scale(1);
		}
	}

	.grow-shrink {
		animation: growAndShrink 0.5s ease-in-out;
	}
</style>
