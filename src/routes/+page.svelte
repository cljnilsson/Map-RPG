<script lang="ts">
	import Inventory from "$lib/features/inventory/inventory.svelte";
	import CharacterComponent from "$lib/components/Character.svelte";
	import type { Character } from "$lib/types/character";

	let resources: {
		iron: number,
		coin: number,
		lumber: number
	} = $state({iron: 0, coin: 0, lumber: 0});

	let character: Character = $state(
		{stats: {str: 5, int: 8, vit: 10, char: 7, dex: 5}, name:"Alice", age: 22, gender: "Female", race: "Human", conditions: []}
	);
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
	<CharacterComponent {character}></CharacterComponent>
	<h3 class="mt-5">Inventory</h3>
	<Inventory></Inventory>
</div>

<style>
	.container {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>