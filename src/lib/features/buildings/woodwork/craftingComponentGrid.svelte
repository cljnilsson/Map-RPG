<script lang="ts">
import type { CraftItem } from "$lib/types/item";
import { safeGetItem } from "$lib/data/items";
import { safeGetResource } from "$lib/data/resources";
let {
	inspectItem,
}: {
	inspectItem: CraftItem;
} = $props();

type ResolvedCostData =
	| ReturnType<typeof safeGetItem>
	| ReturnType<typeof safeGetResource>;

type CombinedCost = {
	kind: "item" | "resource";
	quantity: number;
	data: ResolvedCostData;
};

let combinedCosts: CombinedCost[] = $derived([
	...inspectItem.components.map((c) => ({
		kind: "item" as const,
		quantity: c.quantity,
		data: safeGetItem(c.item),
	})),
	...inspectItem.resourceCosts.map((c) => ({
		kind: "resource" as const,
		quantity: c.amount,
		data: safeGetResource(c.resource),
	})),
]);
</script>

<div class="components border px-3 py-3">
    <p class="mb-0" style="color: #794f36; font-weight: bold;">Components</p>
    <div class="row">
        {#each combinedCosts as c}
    		{#if c.data}
                <div class="col-6 col-m-12">
         			<img
            				src={c.data.iconPath}
            				alt={c.data.name}
            				width={32}
            				height={32}
         			/>
         			{c.quantity}x {c.data.name}
                </div>
    		{:else}
                <div class="col-6">
                    Invalid {c.kind} id, report it!
                </div>
    		{/if}
    	{/each}
    </div>
</div>

<style>
   	.components {
	    border-color: #794f36 !important;
		color: #685247;
	}
</style>
