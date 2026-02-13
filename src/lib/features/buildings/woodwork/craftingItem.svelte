<script lang="ts">
import type { CraftItem } from "$lib/types/item";
import CraftingComponentGrid from "$lib/features/buildings/woodwork/craftingComponentGrid.svelte";

let {
	inspectItem = $bindable(),
}: {
	inspectItem: CraftItem | undefined;
} = $props();
</script>

{#if inspectItem}
    <div class="wrapper">
       	<h5 class="rounded shadow">
    		<img src={inspectItem.iconPath} width={64} height={64} class="me-2" alt={inspectItem.description} /><span
    			>{inspectItem.name}</span
    		>
    	</h5>
    	<p class="mb-0 py-3">{inspectItem.description}</p>
        <CraftingComponentGrid {inspectItem} />
    </div>
{/if}

<style>
    h5 {
	    margin-bottom: 0;
        background-color: #dfb48e !important;
	}

	.wrapper {
	    color: #685247;
	}
</style>
