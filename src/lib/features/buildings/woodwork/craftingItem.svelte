<script lang="ts">
import type { CraftItem } from "$lib/types/item";
import { safeGetItem } from "$lib/data/items";
import { safeGetResource } from "$lib/data/resources";

let {
	inspectItem = $bindable(),
}: {
	inspectItem: CraftItem | undefined;
} = $props();
</script>

{#if inspectItem}
	<h5 class="rounded shadow">
		<img src={inspectItem.iconPath} width={64} height={64} class="me-2" alt={inspectItem.description} /><span
			>{inspectItem.name}</span
		>
	</h5>
	<p class="mb-0 py-3">{inspectItem.description}</p>
	<div class="components border px-3 py-3">
	    <p class="mb-0" style="color: #794f36; font-weight: bold;">Components</p>
        {#each inspectItem.components as c}
 			{@const i = safeGetItem(c.item)}
 			{#if i}
    				{c.quantity}x {i.name}
 			{:else}
    				Invalid item id, report it!
 			{/if}
        {/each}
        {#each inspectItem.resourceCosts as c}
 			{@const r = safeGetResource(c.resource)}
 			{#if r}
    				<img src={r.iconPath} alt={r.name} width={48} height={48} />{c.amount}x {r.name}
 			{:else}
    				Invalid resource id, report it!
 			{/if}
        {/each}
	</div>
{/if}
