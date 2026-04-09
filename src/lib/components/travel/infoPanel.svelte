<script lang="ts">
    import type { pos } from "$lib/utils/math";
    import Saver from "$lib/components/travel/saver.svelte";
    import Loader from "$lib/components/travel/loader.svelte";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import {
        faPenToSquare,
        faCircleMinus,
    } from "@fortawesome/free-solid-svg-icons";

    type path = {
        from: pos;
        to: pos;
        angle: number;
    };

    let {
        waypoints,
        currentlyDragged,
        saves = $bindable(),
        saveName = $bindable(),
        saveSelector = $bindable(),
    }: {
        waypoints: path[];
        saveName: string;
        saves: string[];
        saveSelector: string;
        currentlyDragged: number | null;
    } = $props();

    let editingWaypoint: path | null = $state(null);

    function onRemove(p: path) {
        //
    }
    function onEdit(p: path) {
        console.log(":D");
        editingWaypoint = p;
    }
</script>

<div class="waypoints flex-grow-1 overflow-auto">
    {#each waypoints as w, i}
        <p class="my-2" class:fw-bold={i === currentlyDragged}>
            {w.from.x}
            {w.from.y}
            =>
            {w.to.x}
            {w.to.y}
            {w.angle}
            <button
                type="button"
                onclick={() => {
                    onEdit(w);
                }}
                class="icon-btn"
            >
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button
                type="button"
                onclick={() => {
                    onRemove(w);
                }}
                class="icon-btn"
            >
                <FontAwesomeIcon icon={faCircleMinus} />
            </button>
        </p>
    {/each}
    {#if editingWaypoint}
        <input
            type="number"
            min="0"
            bind:value={editingWaypoint.from.x}
            placeholder="x"
        />
        <input
            type="number"
            min="0"
            bind:value={editingWaypoint.from.y}
            placeholder="y"
        />
        <input
            type="number"
            min="0"
            bind:value={editingWaypoint.to.x}
            placeholder="x"
        />
        <input
            type="number"
            min="0"
            bind:value={editingWaypoint.to.y}
            placeholder="y"
        />
        <input
            type="number"
            min="0"
            bind:value={editingWaypoint.angle}
            placeholder="angle"
        />
    {/if}
</div>

<div class="bottom">
    <Saver {waypoints} bind:saveName bind:saveSelector bind:saves />
    <Loader {saveName} bind:saveSelector {saves} />
</div>

<style>
    .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
    }
</style>
