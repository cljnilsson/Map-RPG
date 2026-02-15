<script lang="ts">
import type { VendorItem } from "$lib/types/item";
import { getItem } from "$lib/data/items";
import Tooltip from "$lib/features/tooltip/tooltipOnHover.svelte";
import { q2c } from "$lib/utils/itemQuality";
import type { Building } from "$lib/types/building";

const { level, building }: { level: number; building: Omit<Building, "componentOnClick"> } = $props();

// Should be random in the future, 5 items seems fair
const currentlyOnOffer: VendorItem[] = $state([
	{
		...getItem("health-potion"),
		type: "vendor",
		price: {
			gold: 1,
			silver: 0,
			copper: 0,
		},
	},
	{
		...getItem("reset-potion"),
		type: "vendor",
		price: {
			gold: 1,
			silver: 0,
			copper: 0,
		},
	},
]);
</script>

<div class="row border justify-content-center">
    {#each currentlyOnOffer as item (item.id)}
        <div class="col-auto my-3">
            <Tooltip>
                {#snippet onHoverTooltip()}
                    <h5 style={"color: " + q2c(item) + ";"}>{item.name}</h5>
                    <p class="mb-0">{item.description}</p>
                    <div class="text-end">
                        <span>{item.price.copper} {item.price.silver} {item.price.gold}</span>
                    </div>
                {/snippet}

                <img src={item.iconPath} alt="" width={64} height={64} />
            </Tooltip>
        </div>
    {/each}
</div>
