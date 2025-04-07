<script lang="ts">
	import type { Snippet } from 'svelte';
	import Die from '$lib/features/die/die.svelte';

	let {
		num,
		children
	}: {
		num: number;
		children: Snippet<[]>;
	} = $props();

	let die: Die[] = [];

	export async function roll() {
		const results = await Promise.all(die.map((d) => d.roll()));
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
		{#each Array(num) as d, i}
			<div class="col-auto">
				<Die bind:this={die[i]} />
			</div>
		{/each}
	</div>
</div>
