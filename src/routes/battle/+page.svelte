<script lang="ts">
    import { PlayerController } from "#lib/controller/character.svelte.js";
    import Army from "#lib/features/battle/army.svelte";
    import InfoWindow from "#lib/features/battle/infoWIndow.svelte";
    import StrategyPicker from "#lib/features/battle/strategyPicker.svelte";
    import AvatarHeaders from "#lib/features/battle/avatarHeader.svelte";
    import { describeStrategyModifier, describeTerrainModifier, resolveCombat, type CombatResult, type Strategy, type Terrain } from "#lib/features/battle/combat.js";
    import type { BattleArmy, BattleStatBase, BattleUnit } from "#lib/types/battle.js";
    import type { PageData } from "./$types";

    let { data }: { data: PageData } = $props();

    const terrainOptions: Terrain[] = ["Forest", "Plains", "City", "Indoors"];
    const terrainBanners: Record<Terrain, string> = {
        Forest: "/Banners/forest.png",
        Plains: "/Banners/plains.png",
        City: "/Banners/city.png",
        Indoors: "/Banners/indoors.png",
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

    let army: BattleArmy = $derived(data.army ?? { friendly: true, name: "Your army", units: [] });

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
                                <select id="terrain" class="form-select terrain-select w-auto" bind:value={terrain}>
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
            {#if !combatResult && army.units.length === 0}
                <p class="text-center fst-italic mb-0">No battle units are available in your first city.</p>
            {/if}
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
                        <div class="card terrain-card">
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
                        disabled={!strat || !terrain || army.units.length === 0}
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
        --battle-panel-background: rgb(23 53 38 / 62%);
        --battle-panel-border: rgb(207 230 188 / 42%);
        --battle-control-background: rgb(224 235 207 / 82%);
        background-color: #405b3b;
        background-image:
            radial-gradient(circle at 15% 20%, rgb(118 151 79 / 70%) 0, transparent 28%),
            radial-gradient(ellipse at 82% 75%, rgb(23 53 38 / 90%) 0, transparent 46%),
            conic-gradient(from 210deg at 45% 45%, #2a4d36, #536d38, #314a30, #405b3b, #2a4d36);
        color: #fff;
    }

    .terrain-plains {
        --battle-panel-background: rgb(255 245 201 / 32%);
        --battle-panel-border: rgb(97 70 32 / 34%);
        --battle-control-background: rgb(255 241 183 / 82%);
        background-color: #d8c987;
        background-image:
            radial-gradient(ellipse at 12% 82%, rgb(160 122 56 / 50%) 0, transparent 36%),
            radial-gradient(circle at 76% 18%, rgb(255 239 163 / 70%) 0, transparent 30%),
            conic-gradient(from 145deg at 55% 55%, #c2ad68, #e7d88f, #b99a58, #d8c987, #c2ad68);
        color: #2f2a1f;
    }

    .terrain-city {
        --battle-panel-background: rgb(31 42 54 / 58%);
        --battle-panel-border: rgb(210 220 224 / 38%);
        --battle-control-background: rgb(219 227 229 / 82%);
        background-color: #59636f;
        background-image:
            radial-gradient(circle at 80% 18%, rgb(154 170 176 / 55%) 0, transparent 24%),
            radial-gradient(ellipse at 18% 75%, rgb(38 47 59 / 90%) 0, transparent 48%),
            conic-gradient(from 290deg at 48% 42%, #45525f, #6a7480, #34434f, #59636f, #45525f);
        color: #fff;
    }

    .terrain-indoors {
        --battle-panel-background: rgb(39 24 18 / 60%);
        --battle-panel-border: rgb(230 196 160 / 36%);
        --battle-control-background: rgb(238 215 184 / 82%);
        background-color: #4b3527;
        background-image:
            radial-gradient(circle at 68% 25%, rgb(151 100 55 / 60%) 0, transparent 22%),
            radial-gradient(ellipse at 20% 82%, rgb(34 20 16 / 85%) 0, transparent 48%),
            conic-gradient(from 235deg at 50% 50%, #36251d, #6a4630, #2b1e19, #4b3527, #36251d);
        color: #fff;
    }

    .terrain-card {
        background-color: var(--battle-panel-background);
        border-color: var(--battle-panel-border);
        color: inherit;
        backdrop-filter: blur(4px);
    }

    .terrain-card .card-header,
    .terrain-card .list-group-item {
        background-color: transparent;
        border-color: var(--battle-panel-border);
        color: inherit;
    }

    .terrain-select {
        background-color: var(--battle-control-background);
        border-color: var(--battle-panel-border);
        color: #2f2a1f;
    }
</style>
