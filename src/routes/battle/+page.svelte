<script lang="ts">
    import { PlayerController } from "$lib/controller/character.svelte";
    import Army from "$lib/features/battle/army.svelte";
    import InfoWindow from "$lib/features/battle/infoWIndow.svelte";
    import StrategyPicker from "$lib/features/battle/strategyPicker.svelte";
    import AvatarHeaders from "$lib/features/battle/avatarHeader.svelte";
    import { describeStrategyModifier, describeTerrainModifier, resolveCombat, type CombatResult, type Strategy, type Terrain } from "$lib/features/battle/combat";
    import type { BattleArmy, BattleStatBase, BattleUnit } from "$lib/types/battle";

    const terrainOptions: Terrain[] = ["Forest", "Plains", "City", "Indoors"];
    const terrainBanners: Record<Terrain, string> = {
        Forest: "/Banners/forest.jpg",
        Plains: "/Banners/plains.png",
        City: "/Banners/city.jpg",
        Indoors: "/Banners/indoors.jpg",
    };
    let terrain: Terrain | undefined = $state(undefined);
    const strategyOptions: Strategy[] = ["Charge", "Hold the line", "Flank"];

    let strat: Strategy | undefined = $state(undefined);
    let combatResult: CombatResult | null = $state(null);

    // Temp stat types for testing
    const hp: BattleStatBase = { name: "Health", description: "Current hit points" };
    const bp: BattleStatBase = { name: "Battle Power", description: "Damage dealt" };
    const armor: BattleStatBase = { name: "Armor", description: "Defense" };
    const mobility: BattleStatBase = { name: "Mobility", description: "Movement speed" };

    // Demo armies
    const army: BattleArmy = {friendly: true, units: [
        {
            name: "Soldier",
            amount: 2,
            icon: "/units/soldier.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 10 },
                { ...armor, value: 2 },
                { ...mobility, value: 2 },
            ],
        },
        {
            name: "Captain",
            amount: 1,
            icon: "/units/captain.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 15 },
                { ...armor, value: 3 },
                { ...mobility, value: 2 },
            ],
        },
        {
            name: "Ranger",
            amount: 2,
            icon: "/units/ranger.png",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 8 },
                { ...armor, value: 1 },
                { ...mobility, value: 3 },
            ],
        },
        {
            name: "Dog",
            amount: 2,
            icon: "/units/wolf.png",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 12 },
                { ...armor, value: 0 },
                { ...mobility, value: 4 },
            ],
        },
    ]};

    const army2: BattleArmy = {friendly: false, name: "Orc Warband", hideUnitAmounts: true, units: [
        {
            name: "Marauder",
            amount: 4,
            icon: "/units/orc1.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 20 },
                { ...armor, value: 3 },
                { ...mobility, value: 2 },
            ],
        },
        {
            name: "Witch",
            amount: 1,
            icon: "/units/orc-witch.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 15 },
                { ...armor, value: 1 },
                { ...mobility, value: 1 },
            ],
        },
        {
            name: "Assassin",
            amount: 2,
            icon: "/units/orc-assassin.jpg",
            stats: [
                { ...bp, value: 15 },
                { ...hp, value: 5 },
                { ...armor, value: 1 },
                { ...mobility, value: 3 },
            ],
        },
        {
            name: "Warchief",
            amount: 1,
            icon: "/units/orc2.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 25 },
                { ...armor, value: 3 },
                { ...mobility, value: 2 },
            ],
        },
    ]};

    let hovering: {unit: BattleUnit, from: BattleArmy} | null = $state(null);


    // Funcs
    function onUnitHover(u: BattleUnit | null, from: BattleArmy) {
        hovering = u === null ? null : { unit: { ...u }, from: { ...from } };
    }

    function engage() {
        if (!strat || !terrain) return;
        combatResult = resolveCombat(army, army2, { terrain, attackerStrategy: strat });
    }
</script>

<div class="battle-wrapper my-3 position-relative">
    <div class="row justify-content-center mx-0">
        <div class="col-md-10 col-lg-8 col-xl-6 battle-shell" class:page-surface={!terrain}>
            <div
                class="battle-banner rounded-3 pb-5"
                class:text-white={terrain !== undefined}
                style:background-image={terrain ? `url("${terrainBanners[terrain]}")` : undefined}
            >
                <h2 class="text-center">{combatResult ? "Post-battle" : "Battle"}</h2>
                <AvatarHeaders />
            </div>
            <div
                class="battle-content pt-3 p-3 rounded-3"
                class:terrain-forest={terrain === "Forest"}
                class:terrain-plains={terrain === "Plains"}
                class:terrain-city={terrain === "City"}
                class:terrain-indoors={terrain === "Indoors"}
            >
                {#if !combatResult}
                    <div class="row">
                        <div class="col text-center py-3">
                            <div class="d-inline-flex align-items-center gap-2">
                                <label for="terrain" class="fw-bold">Terrain:</label>
                                <select id="terrain" class="form-select w-auto" bind:value={terrain}>
                                    <option value={undefined} disabled>Select terrain</option>
                                    {#each terrainOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                {/if}
            <div class="row">
                <div class="col-6 text-end">
                    <span><b>{army.name ?? `${PlayerController.name}'s army`}</b></span>
                    <Army side="left" {army} {onUnitHover} losses={combatResult?.attackerLosses} postBattle={combatResult !== null} />
                </div>
                <div class="col-6">
                    <span><b>{army2.name ?? "Enemy army"}</b></span>
                    <Army side="right" army={army2} {onUnitHover} losses={combatResult?.defenderLosses} postBattle={combatResult !== null} />
                </div>
            </div>
            {#if combatResult}
                <div class="row justify-content-center mt-4">
                    <div class="col-md-8 col-lg-6 text-center">
                        <div class="card">
                            <div class="card-body">
                                <h4 class="card-title">
                                    {combatResult.winner === "draw"
                                        ? "The battle ends in a draw"
                                        : combatResult.winner === "attacker"
                                            ? `${army.name ?? PlayerController.name}'s army wins`
                                            : `${army2.name ?? "Enemy army"} wins`}
                                </h4>
                                {#if combatResult.rewards}
                                    <p class="mb-2"><b>Winner's rewards:</b> {combatResult.rewards.gold} gold{combatResult.rewards.item ? ` and ${combatResult.rewards.item}` : ""}</p>
                                {/if}
                                <p class="fst-italic mb-0">{combatResult.flavorText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            {:else}
                <StrategyPicker {strategyOptions} bind:strat />
                <div class="row justify-content-center my-3">
                    <div class="col-md-10 col-lg-8 col-xl-6">
                        <div class="card">
                            <div class="card-header">Battle modifiers</div>
                            <ul class="list-group list-group-flush text-start">
                                <li class="list-group-item">
                                    <b>{terrain ?? "Choose terrain"}:</b>
                                    {terrain ? describeTerrainModifier(terrain) : " Select terrain to see its modifier."}
                                </li>
                                <li class="list-group-item">
                                    <b>{strat ?? "Choose a strategy"}:</b>
                                    {strat ? describeStrategyModifier(strat) : " Select a strategy to see its modifiers."}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="text-center mt-3">
                    <button
                        type="button"
                        class="btn btn-lg btn-primary"
                        disabled={!strat || !terrain}
                        onclick={engage}>Engage</button>
                </div>
            {/if}
            </div>
        </div>
    </div>
        {#if hovering}
            <InfoWindow hovering={hovering.unit} friendly={hovering?.from.friendly} />
        {/if}
    </div>

<style>
    .battle-banner {
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        min-height: 8rem;
    }

    .terrain-forest {
        background-color: #405b3b;
        color: #fff;
    }

    .terrain-plains {
        background-color: #d8c987;
        color: #2f2a1f;
    }

    .terrain-city {
        background-color: #59636f;
        color: #fff;
    }

    .terrain-indoors {
        background-color: #4b3527;
        color: #fff;
    }
</style>
