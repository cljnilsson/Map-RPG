<script lang="ts">
    import { PlayerController } from "$lib/controller/character.svelte";
    import Army from "$lib/features/battle/army.svelte";
    import InfoWindow from "$lib/features/battle/infoWIndow.svelte";

    const width = 200;
    const height = 200;
    const terrain: "Forest" | "Plains" | "City" | "Indoors" = "Plains";
    const strategyOptions: string[] = ["Charge", "Hold the line", "Flank"];

    let strat: string | undefined = $state(undefined);

    type statBase = { name: string; description: string };
    type stat = { value: number } & statBase;
    type Unit = { name: string; amount: number; icon: string; stats: stat[] };
    type PlayerArmy = {friendly: boolean, units:Unit[]};

    const hp: statBase = { name: "Health", description: "Current hit points" };
    const bp: statBase = { name: "Battle Power", description: "Damage dealt" };

    const army: PlayerArmy = {friendly: true, units: [
        {
            name: "Soldier",
            amount: 2,
            icon: "/units/soldier.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 10 },
            ],
        },
        {
            name: "Captain",
            amount: 1,
            icon: "/units/captain.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 15 },
            ],
        },
        {
            name: "Ranger",
            amount: 2,
            icon: "/units/ranger.png",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 8 },
            ],
        },
        {
            name: "Dog",
            amount: 2,
            icon: "/units/wolf.png",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 12 },
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
            ],
        },
        {
            name: "Witch",
            amount: 1,
            icon: "/units/orc-witch.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 15 },
            ],
        },
        {
            name: "Assassin",
            amount: 2,
            icon: "/units/orc-assassin.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 10 },
            ],
        },
        {
            name: "Warchief",
            amount: 1,
            icon: "/units/orc2.jpg",
            stats: [
                { ...bp, value: 5 },
                { ...hp, value: 25 },
            ],
        },
    ]};

    console.log("a", army, army2);

    let hovering: {unit:Unit, from: PlayerArmy} | null = $state(null);

    function onUnitHover(u: Unit | null, from: PlayerArmy) {
        hovering = u === null ? null : { unit: { ...u }, from: { ...from } };
    }
</script>

<div class="battle-wrapper my-3 mx-5 position-relative">
    <div class="row">
        <div class="col">
            <h2 class="text-center">Battle</h2>
            <div class="row">
                <div class="col text-end">
                    <img
                        src={PlayerController.imagePath}
                        alt="Your character"
                        loading="lazy"
                        fetchpriority="high"
                        style="width: {width}px;
                                    height: {height}px;"
                    />
                </div>
                <div class="col">
                    <img
                        src={"/orc.png"}
                        alt="Enemy"
                        loading="lazy"
                        fetchpriority="high"
                        style="width: {width}px;
                                    height: {height}px;"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col text-center py-3">
                    <h5>Terrain: {terrain}</h5>
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
            <div class="row justify-content-center my-3">
                <div class="col-auto">
                    <h5>Strategy</h5>
                    {#each strategyOptions as s, i}
                        <div class="form-check">
                            <input
                                class="form-check-input"
                                type="radio"
                                name="radioDefault"
                                id={`radioDefault${i}`}
                                bind:group={strat}
                                value={s}
                            />
                            <label
                                class="form-check-label"
                                for={`radioDefault${i}`}
                            >
                                {s}
                            </label>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="row justify-content-center my-3">
                <div class="col-auto">All modifiers here</div>
            </div>
            <div class="text-center mt-3">
                <button
                    type="button"
                    class="btn btn-lg btn-primary"
                    disabled={!strat}>Engage</button
                >
            </div>
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
