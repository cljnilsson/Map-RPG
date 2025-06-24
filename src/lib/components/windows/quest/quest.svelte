<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
</script>

<!-- Assume the player owns all cities for testing purposes -->
<Window
	height={200}
	width={300}
	x={1300}
	y={1250}
	toggleKey="n"
	bind:visibility={WindowStore.navigationVisibility}
>
	{#snippet title()}
		<h4 class="my-2">Quests</h4>
	{/snippet}
	{#snippet body()}
	<div class="row">
		<div class="col">
			{#each [] as q}
				<p>{q}</p>
			{/each}
		</div>
	</div>
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>

<style lang="scss">
	p {
		&:hover {
			font-weight: bold;
		}
	}
</style>
