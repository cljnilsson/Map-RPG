<script lang="ts">
	import CharacterComponent from "$lib/components/character/Character.svelte";
</script>

<div class="container mt-3">
	<h1>Welcome</h1>
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