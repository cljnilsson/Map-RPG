<script lang="ts">
	import Window from "$lib/features/window/window.svelte";
	import WindowStore from "$lib/stores/windows.svelte";
    import type { VendorNPC } from "$lib/types/npc";

    let {vendor}: {vendor: VendorNPC} = $props();
</script>

<Window height={700} width={480} x={300} y={450} bind:visibility={WindowStore.vendorVisibility}>
	{#snippet title()}
		<h4 class="my-2">{vendor.name}</h4>
	{/snippet}
	{#snippet body()}
		{#each vendor.items as item}
            <p>{item}</p>
		{:else}
			<p>This vendor sells no items.</p>
        {/each}
	{/snippet}
	{#snippet footer()}
		<span></span>
	{/snippet}
</Window>
