<script lang="ts">
	import WindowController from "$lib/controller/window.svelte";
	import RollWindow from "$lib/components/windows/roll/roll.svelte";

	async function roll() {
		WindowController.getByName("Roll").visible = true;
	}
</script>

<div class="wrapper mt-5 mx-5 px-3">
	<div class="text-center my-5">
		<button class="btn btn-outline-dark" onclick={roll}>Roll</button>
	</div>
</div>
<RollWindow />

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
