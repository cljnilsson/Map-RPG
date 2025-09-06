<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowController from "$lib/controller/window.svelte";
	import DieCollection from "$lib/features/die/dieCollection.svelte";

	let diceRef: DieCollection;

	async function roll() {
		const result = await diceRef?.roll();
		const total = result.reduce((newValue, currentValues) => currentValues + newValue);

		console.log(total);
	}

	let rollWindow = WindowController.getByName("Roll");
</script>

<Window
	uniqueKey="Roll"
	height={400}
	width={600}
	x={rollWindow.x}
	y={rollWindow.y}
	canClose={false}
	canLock={false}
	canMinimize={false}
	bind:visibility={rollWindow.visible}
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
