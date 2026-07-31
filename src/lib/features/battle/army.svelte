<script lang="ts">
    import type { BattleArmy, BattleUnit } from "$lib/types/battle";

    let {army, side, onUnitHover}: {side: "left" | "right", army: BattleArmy, onUnitHover: (unit: BattleUnit | null, from: BattleArmy) => void} = $props();

    function onHoverCallback(u: BattleUnit | null) {
      onUnitHover(u, army);
      console.log("Passing it on");
    }
</script>

<div class="row mt-3" class:border-end={side === "left"} class:border-primary={side === "left"} class:border-danger={side === "right"} class:border-start={side === "right"}>
    <div class="col-xl-4 col-md-6 col-sm-8 col-12" class:offset-xl-8={side === "left"} class:offset-md-6={side === "left"} class:offset-sm-4={side === "left"}>
        {#each army.units as a}
            {#if a}
                {#if side === "right"}
                   	<div class="row align-items-center">
                       	<div class="col-2">
                           	<span class="unit-amount">{a.amount}</span>
                       	</div>
                       	<div class="col-5">
                            <span class="unit-name">{a.name}</span>
                       	</div>
                        <div class="col-auto">
                      		<img
                          		src={a.icon}
                                onmouseenter={() => onHoverCallback(a)}
                                onmouseleave={() => onHoverCallback(null)}
                          		alt={`Unit portrait of ${a.name}`}
                          		loading="lazy"
                          		fetchpriority="high"
                          		style="width: 48px;
                                            height: 48px;"
                           	/>
                        </div>
                    </div>
                {:else}
                   	<div class="row align-items-center justify-content-end text-end">
                        <div class="col-auto">
                      		<img
                          		src={a.icon}
                                onmouseenter={() => onHoverCallback(a)}
                                onmouseleave={() => onHoverCallback(null)}
                          		alt={`Unit portrait of ${a.name}`}
                          		loading="lazy"
                          		fetchpriority="high"
                          		style="width: 48px;
                                            height: 48px;"
                           	/>
                        </div>
                       	<div class="col-5">
                           	<span class="unit-name">{a.name}</span>
                       	</div>
                       	<div class="col-2">
                           	<span class="unit-amount">{a.amount}</span>
                       	</div>
                    </div>
                {/if}
            {:else}
                <p>Something went wrong here</p>
            {/if}
        {/each}
        <div class="row">
           	<div class="col">
               	<span class="unit-total fw-bold">{army.units.reduce((a, b) => a + b.amount, 0)}</span>
           	</div>
        </div>
    </div>
</div>


<style>
    .unit-name, .unit-amount, .unit-total {
        font-size: 1.2rem;
    }

    .border-start, .border-end {
        border-width: 3px !important;
    }
</style>
