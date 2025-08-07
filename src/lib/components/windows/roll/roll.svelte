<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
	import DieCollection from "$lib/features/die/dieCollection.svelte";

	let diceRef: DieCollection;

	async function roll() {
		const result = await diceRef?.roll();
		const total = result.reduce((newValue, currentValues) => currentValues + newValue);

		console.log(total);
	}
</script>

<Window
	uniqueKey="Roll"
	height={400}
	width={600}
	x={WindowStore.roll.x}
	y={WindowStore.roll.y}
	canClose={false}
	canLock={false}
	canMinimize={false}
	bind:visibility={WindowStore.roll.visible}
>
	{#snippet title()}
		<h2 class="text-center">Roll!</h2>
	{/snippet}
	{#snippet body()}
		<DieCollection num={2} sides={20} modifier={3} bind:this={diceRef} clickable={false} />
	{/snippet}
	{#snippet footer()}
		<div class="text-center mt-5">
			<button class="btn btn-outline-dark" onclick={roll}>Roll</button>
		</div>
	{/snippet}
</Window>
