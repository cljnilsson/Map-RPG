<script lang="ts">
	import type { VendorItem } from "$lib/types/item";
	import { getItem } from "$lib/data/items";
    import Tooltip from "$lib/features/tooltip/tooltip.svelte";
	import {q2c} from "$lib/utils/itemQuality";
	import type { Building } from "$lib/types/building";
    import ItemGrid from "$lib/components/itemGrid.svelte";
    
	const rows = 8;
	const slots = 6 * rows;
    let arrayDemo = [1, 2, 3]
</script>


<ItemGrid items={arrayDemo} size={slots}>
    {#snippet item(test: number)}
        {test}
    {/snippet}
</ItemGrid>