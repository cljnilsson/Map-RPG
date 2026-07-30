<script lang="ts">
    import { PlayerController } from "$lib/controller/character.svelte";
    import Army from "$lib/features/battle/army.svelte";
    import InfoWindow from "$lib/features/battle/infoWIndow.svelte";
    import StrategyPicker from "$lib/features/battle/strategyPicker.svelte";
    import AvatarHeaders from "$lib/features/battle/avatarHeader.svelte";
    import { resolveCombat, type CombatResult, type Strategy, type Terrain } from "$lib/features/battle/combat";

    const terrainOptions: Terrain[] = ["Forest", "Plains", "City", "Indoors"];
    let terrain: Terrain = $state("Plains");
    const strategyOptions: Strategy[] = ["Charge", "Hold the line", "Flank"];

    let strat: Strategy | undefined = $state(undefined);
    let combatResult: CombatResult | null = $state(null);

    // Move into a separate file for reusability
    type statBase = { name: string; description: string };
    type stat = { value: number } & statBase;
    type Unit = { name: string; amount: number; icon: string; stats: stat[] };
    type PlayerArmy = {friendly: boolean, units:Unit[]};

    // Temp stat types for testing
    const hp: statBase = { name: "Health", description: "Current hit points" };
    const bp: statBase = { name: "Battle Power", description: "Damage dealt" };
    const armor: statBase = { name: "Armor", description: "Defense" };
    const mobility: statBase = { name: "Mobility", description: "Movement speed" };

    // Demo armies
    const army: PlayerArmy = {friendly: true, units: [
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

    const army2: PlayerArmy = {friendly: false, units: [
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

    let hovering: {unit:Unit, from: PlayerArmy} | null = $state(null);


    // Funcs
    function onUnitHover(u: Unit | null, from: PlayerArmy) {
        hovering = u === null ? null : { unit: { ...u }, from: { ...from } };
    }

    function engage() {
        if (!strat) return;
        combatResult = resolveCombat(army, army2, { terrain, attackerStrategy: strat });
    }
</script>

<div class="battle-wrapper my-3 mx-5 position-relative">
    <div class="row">
        <div class="col">
            <h2 class="text-center">Battle</h2>
            <AvatarHeaders />
            <div class="row">
                <div class="col text-center py-3">
                    <label for="terrain" class="me-2 fw-bold">Terrain:</label>
                    <select id="terrain" bind:value={terrain}>
                        {#each terrainOptions as option}
                            <option value={option}>{option}</option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-6 text-end">
                    <span><b>{PlayerController.name}</b>'s army</span>
                    <Army side="left" {army} {onUnitHover} />
                </div>
                <div class="col-6">
                    <span><b>Enemy</b>'s army</span>
                    <Army side="right" army={army2} {onUnitHover} />
                </div>
            </div>
            <StrategyPicker {strategyOptions} bind:strat />
            <div class="row justify-content-center my-3">
                <div class="col-auto">All modifiers here</div>
            </div>
            <div class="text-center mt-3">
                <button
                    type="button"
                    class="btn btn-lg btn-primary"
                    disabled={!strat}
                    onclick={engage}>Engage</button
                >
            </div>
            {#if combatResult}
                <div class="row justify-content-center mt-4">
                    <div class="col-auto text-center">
                        <h4>
                            {combatResult.winner === "draw"
                                ? "The battle ends in a draw"
                                : combatResult.winner === "attacker"
                                    ? `${PlayerController.name}'s army wins`
                                    : "Enemy army wins"}
                        </h4>
                        <p class="mb-1"><b>Your losses:</b> {combatResult.attackerLosses.map((loss) => `${loss.name}: ${loss.lost}`).join(", ")}</p>
                        <p><b>Enemy losses:</b> {combatResult.defenderLosses.map((loss) => `${loss.name}: ${loss.lost}`).join(", ")}</p>
                    </div>
                </div>
            {/if}
        </div>
        {#if hovering}
            <InfoWindow hovering={hovering.unit} friendly={hovering?.from.friendly} />
        {/if}
    </div>
</div>

<style>
    .battle-wrapper {
        background: rgba(235, 235, 235, 0.6);
        border-radius: 10px;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
    }
</style>
