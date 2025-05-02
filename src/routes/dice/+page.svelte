<script lang="ts">
	import DieCollection from "$lib/features/die/dieCollection.svelte";

	let diceRef: DieCollection;

	async function roll() {
		let result = await diceRef?.roll();
		console.log(result);
	}
</script>

<div class="wrapper mt-5 mx-5 px-3">
	<DieCollection num={2} bind:this={diceRef}>
		<h2 class="text-center mb-5">Roll!</h2>
	</DieCollection>
	<div class="text-center mt-5">
		<button class="btn btn-outline-dark" onclick={roll}>Roll</button>
	</div>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
