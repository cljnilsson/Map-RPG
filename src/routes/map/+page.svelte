<script lang="ts">
    import Map from '$lib/components/map.svelte';
    import { world, winterfell, kingsLanding } from '$lib/tempData';
    import type { CustomMap} from "$lib/types/mapTypes";

	let state: CustomMap | null = $state(world);
</script>

{#if state}
	<h3>{state.map?.name}</h3>
	{#if state.previous}
		<button
			onclick={() => {
				if (state?.previous) {
					state = state.previous;
				}
			}}>Back</button
		>
	{/if}
    <Map bind:state={state}></Map>
{:else}
	<p>No map chosen</p>
	{#each [world, winterfell, kingsLanding] as map}
		<button
			onclick={() => {
				state = map;
			}}>{map.map?.name}</button
		>
	{/each}
{/if}