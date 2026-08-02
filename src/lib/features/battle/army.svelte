<script lang="ts">
    import type { BattleArmy, BattleUnit, UnitLoss } from "$lib/types/battle";

    let {army, side, onUnitHover, losses = [], postBattle = false}: {
        side: "left" | "right";
        army: BattleArmy;
        onUnitHover: (unit: BattleUnit | null, from: BattleArmy) => void;
        losses?: UnitLoss[];
        postBattle?: boolean;
    } = $props();

    function onHoverCallback(u: BattleUnit | null) {
        onUnitHover(u, army);
    }

    function unitLoss(unit: BattleUnit) {
        return losses.find((loss) => loss.name === unit.name)?.lost ?? 0;
    }

    function displayedAmount(unit: BattleUnit) {
        if (army.hideUnitAmounts) return "?";
        return postBattle ? unit.amount - unitLoss(unit) : unit.amount;
    }

    function displayedTotal() {
        if (army.hideUnitAmounts) return "?";
        return army.units.reduce((total, unit) => total + (postBattle ? unit.amount - unitLoss(unit) : unit.amount), 0);
    }
</script>

<div class="row mt-3 border-3" class:border-end={side === "left"} class:border-primary={side === "left"} class:border-danger={side === "right"} class:border-start={side === "right"}>
    <div class="col-xl-6 col-md-6 col-sm-8 col-12" class:offset-xl-6={side === "left"} class:offset-md-6={side === "left"} class:offset-sm-4={side === "left"}>
        {#each army.units as unit}
            {@const lost = unitLoss(unit)}
            <div class="row align-items-center" class:flex-row-reverse={side === "left"} class:text-end={side === "left"}>
                <div class="col-2 fs-5">
                    <span>{displayedAmount(unit)}</span>
                    {#if postBattle && !army.hideUnitAmounts && lost > 0}
                        <span class="text-danger ms-1">(-{lost})</span>
                    {/if}
                </div>
                <div class="col-5 fs-5">
                    <span>{unit.name}</span>
                </div>
                <div class="col-auto">
                    <img
                        src={unit.icon}
                        onmouseenter={() => onHoverCallback(unit)}
                        onmouseleave={() => onHoverCallback(null)}
                        alt={`Unit portrait of ${unit.name}`}
                        loading="lazy"
                        fetchpriority="high"
                        width="48"
                        height="48"
                    />
                </div>
            </div>
        {/each}
        <div class="row">
           	<div class="col">
                <span class="fs-5 fw-bold">{displayedTotal()}</span>
           	</div>
        </div>
    </div>
</div>
