<script lang="ts">
	import CharacterComponent from "$lib/components/character/Character.svelte";

	let resources: {
		iron: number,
		coin: number,
		lumber: number
	} = $state({iron: 0, coin: 0, lumber: 0});
</script>

<div class="container mt-3">
	<h1>Welcome</h1>
	<h3 class="mt-5">Resources</h3>
	<div class="row">
		<div class="col-auto">
			<h4><i class="bi bi-coin"></i> {resources.coin}</h4>
		</div>
		<div class="col-auto">
			<h4><i class="bi bi-minecart-loaded"></i> {resources.iron}</h4>
		</div>
		<div class="col-auto">
			<h4><i class="bi bi-tree"></i> {resources.iron}</h4>
		</div>
	</div>
	<CharacterComponent />
</div>

<style>
	.container {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>