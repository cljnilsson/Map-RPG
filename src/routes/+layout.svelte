<script lang="ts">
    import CharacterStore from "$lib/stores/character.svelte";

    import "./styles.scss";
    import Nav from "$lib/partials/nav.svelte";
    import { onMount, type Snippet } from "svelte";
    import type { LayoutData } from "$lib/types/layoutData";
    import Tutorial from "$lib/game/tutorial.svelte";
    import Notification from "$lib/features/notification/notification.svelte";
    import { getItem } from "$lib/data/items";
    import { getAllCharacters } from "$lib/api/character.remote";
    import { getCityResources } from "$lib/utils/resources";
    import type { Character } from "$lib/server/db/schema";
    import { source } from "sveltekit-sse";
    import SettingsController from "$lib/controller/settings.svelte";
    import { authClient } from "$lib/auth-client";

    let { children, data }: { children: Snippet<[]>; data: LayoutData } =
        $props();
    const session = authClient.useSession();
    let isLoggedIn: boolean = $derived(!!$session.data?.user);

    let loaded = $state(false);
    let flags: { name: string; value: boolean }[] = $derived(
        data?.userFlags.map((flag: { name: string; value: number }) => ({
            name: flag.name,
            value: flag.value === 1,
        })) ?? [],
    );

    function getFlagByName(name: string): boolean | undefined {
        return flags.find((flag) => flag.name === name)?.value;
    }

    let tutorialCompleted = true; //$state(getFlagByName("tutorialCompleted"));
    type CharacterWithStats = Character & {
        stats: { name: string; value: number }[];
    };

    async function loadCharacter() {
        const chars = await getAllCharacters();

        // Always loads the first one rather than selecting from user choice, fix later
        if (chars.characters.length > 0) {
            const character = chars.characters[0];

            if (character.stats.length < 5) {
                console.error(
                    "Something is wrong with the loaded character, missing stats.",
                );
                return;
            }

            CharacterStore.character = {
                id: character.id,
                name: character.name,
                health: character.health,
                maxHealth: character.maxHealth,
                age: character.age,
                gender: character.gender,
                race: character.race,
                class: character.class,
                faith: character.faith,
                conditions: [],
                xp: character.xp,
                imagePath: character.imagePath,
                level: character.level,
                stats: {
                    str: character.stats.filter((v) => v.name === "Strength")[0]
                        .value,
                    int: character.stats.filter(
                        (v) => v.name === "Intelligence",
                    )[0].value,
                    vit: character.stats.filter((v) => v.name === "Vitality")[0]
                        .value,
                    char: character.stats.filter(
                        (v) => v.name === "Charisma",
                    )[0].value,
                    dex: character.stats.filter(
                        (v) => v.name === "Dexterity",
                    )[0].value,
                },
                money: {
                    gold: character.gold,
                    silver: character.silver,
                    copper: character.copper,
                },
            };
            console.log("Loaded character");
        } else {
            console.warn("No characters found");
        }
    }

    type serverPing = {
        cityId: number;
        name: string;
        resource: string;
        value: number;
    };

    // Ensure one login attempt had been made
    async function onLoginAttempt() {
        console.log("tries");
        if ($session.data?.user) {
            await loadCharacter();
            SettingsController.load($session.data.user.id);

            // Will load from DB eventually
            if (
                CharacterStore.character &&
                CharacterStore.inventory.length === 0
            ) {
                CharacterStore.inventory = [
                    // Throwaway testing items
                    { item: getItem("test-item-1"), amount: 1 },
                    { item: getItem("test-item-2"), amount: 1 },
                    { item: getItem("test-item-3"), amount: 3 },
                    // 'real' items
                    { item: getItem("health-potion"), amount: 3 },
                    { item: getItem("old-book"), amount: 1 },
                ];
            }
        }
        loaded = true;
    }

    $effect(() => {
        if (!loaded) {
            if ($session.isPending === false) {
                onLoginAttempt();
            }
        }
    });

    onMount(() => {
        let unsubscribe: (() => void) | undefined;

        try {
            const hr = source("/api/resources");
            // Wip waiting for query.live instead
            /*const json = hr
                .select("message")
                .json<{ timpStamp: Date; data: serverPing[] }>((or) => {
                    console.log(or);
                    if (!or.raw) return or.previous;

                    try {
                        return JSON.parse(or.raw);
                    } catch (err) {
                        console.error("JSON parse failed:", err);
                        return or.previous;
                    }
                });

            unsubscribe = json.subscribe((message) => {
                if (!message?.data) return;
                getCityResources(message.data);
                });*/
        } catch (err) {
            console.error("SSE connection failed:", err);
        }

        return () => {
            unsubscribe?.();
        };
    });
</script>

<svelte:head>
    <link rel="icon" type="image/svg" href="/favicon.png" />
    <title>Travian x DnD</title>
    <meta
        name="description"
        content="A SPA-ish web game based on both Travian and DnD."
    />
    <link rel="stylesheet" href="/bootstrap/bootstrap.min.css" />
    <link rel="stylesheet" href="/bootstrap/bootstrap-icons.min.css" />
    <script src="/bootstrap/bootstrap.bundle.min.js" defer></script>
</svelte:head>

<div class="container-fluid p-0">
    <Nav {data}></Nav>
    {#if loaded}
        {#if !tutorialCompleted}
            <Tutorial />
        {:else}
            <Notification />
        {/if}
        {@render children()}
    {/if}
</div>

<style>
    .container-fluid {
        min-height: 100%;
        background-image: url("/bg.webp");
        background-size: cover;
        background-repeat: repeat-y;
    }
</style>
