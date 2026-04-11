<script lang="ts">
    import type { pos } from "$lib/utils/math";
    import Saver from "$lib/components/travel/saver.svelte";
    import Loader from "$lib/components/travel/loader.svelte";
    import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
    import {
        faPenToSquare,
        faCircleMinus,
        faPlus,
        faMinus,
        faCircle,
    } from "@fortawesome/free-solid-svg-icons";
    import { faCircle as regFaCircle } from "@fortawesome/free-regular-svg-icons";
    import WaypointViewerFull from "$lib/components/travel/waypointViewer.svelte";
    import WaypointViewerCompact from "$lib/components/travel/waypointViewerCompact.svelte";
    import Dropdown from "$lib/components/travel/dropdown.svelte";

    type path = {
        from: pos;
        to: pos;
        angle: number;
    };

    let {
        waypoints = $bindable(),
        currentlyDragged,
        nodes = $bindable(),
        saves = $bindable(),
        saveName = $bindable(),
        saveSelector = $bindable(),
    }: {
        waypoints: path[];
        saveName: string;
        saves: string[];
        saveSelector: string;
        currentlyDragged: number | null;
        nodes: pos[];
    } = $props();

    // TODO, add scrollwheel to modify angle
    // change from and to from each path with dropdown
    // Visual indicator for what is currently being edited

    let editingWaypoint: path | null = $state(null);
    let newWaypoint: pos | null = $state(null);
    let isCreating: boolean = $state(false);
    let viewFull: boolean = $state(true);
    let nodeSelectorFrom: pos | null = $state(null);
    let nodeSelectorTo: pos | null = $state(null);
    let error: string = $state("");

    function onRemove(p: path) {
        //
    }

    function onEdit(p: path) {
        console.log(":D");
        editingWaypoint = p;
        newWaypoint = null;
        isCreating = false;
        nodeSelectorFrom = p.from;
        nodeSelectorTo = p.to;
    }

    function onAddFresh() {
        console.log(":D");
        if (isCreating) {
            isCreating = false;
            newWaypoint = null;
            return;
        }
        editingWaypoint = null;
        nodeSelectorFrom = null;
        nodeSelectorTo = null;
        newWaypoint = { x: 0, y: 0 };
        isCreating = true;
    }

    function confirmNewNode() {
        if (!newWaypoint) {
            console.warn("Wops, should not be able to run this function.");
            return;
        }

        nodes = [
            ...nodes,
            {
                x: newWaypoint.x,
                y: newWaypoint.y,
            },
        ];

        // For testing purposes just adds to the end as default, assumes it's not the first node. TODO, handle this edge case
        waypoints = [
            ...waypoints,
            {
                from: nodes[nodes.length - 2],
                to: nodes[nodes.length - 1],
                angle: 0,
            },
        ];
    }
</script>

<div class="waypoints flex-grow-1">
    <h3 class="py-2 mb-0">Editor</h3>
    {#if error.length > 0}
        <div class="alert alert-danger my-2" role="alert">
            {error}
        </div>
    {/if}
    <div class="innerWaypointwrapper px-3 py-2">
        {#if viewFull}
            <div class="row header py-1">
                <div class="col-fixed">From</div>
                <div class="col-arrow g-0"></div>
                <div class="col-fixed">To</div>
                <div class="col-angle g-0">Angle</div>
                <div class="col-actions"></div>
            </div>
        {:else}
            <div class="row header py-1">
                <div class="col-fixed">Node</div>
                <div class="col-angle g-0">Angle</div>
            </div>
        {/if}
        {#each waypoints as w, i}
            {#if viewFull}
                <WaypointViewerFull
                    {i}
                    {w}
                    {currentlyDragged}
                    {onRemove}
                    {onEdit}
                />
            {:else}
                <WaypointViewerCompact
                    {i}
                    {w}
                    {waypoints}
                    {currentlyDragged}
                    {onRemove}
                    {onEdit}
                />
            {/if}
        {/each}
    </div>
    <button
        type="button"
        onclick={onAddFresh}
        class="btn btn-primary btn-sm my-2"
    >
        {#if isCreating}
            <FontAwesomeIcon icon={faMinus} class="iconSecondary" />
        {:else}
            <FontAwesomeIcon icon={faPlus} class="iconSecondary" />
        {/if}
    </button>
    <button
        type="button"
        onclick={() => (viewFull = !viewFull)}
        class="btn btn-primary btn-sm my-2"
    >
        {#if viewFull}
            <FontAwesomeIcon icon={faCircle} class="iconSecondary" />
        {:else}
            <FontAwesomeIcon icon={regFaCircle} class="iconSecondary" />
        {/if}
    </button>
    {#if editingWaypoint}
        <h3 class="py-2 mb-0">Editing Waypoint</h3>
        <div class="row py-2">
            <div class="col-auto">
                <Dropdown
                    text="{nodeSelectorFrom === null
                        ? 'Select node'
                        : nodeSelectorFrom.x + ',' + nodeSelectorFrom.y},"
                    options={nodes.map((v) => ({
                        val: v,
                        text: `${v.x}, ${v.y}`,
                    }))}
                    onclick={(n: pos) => (nodeSelectorFrom = n)}
                />
            </div>
            <div class="col">
                <Dropdown
                    text="{nodeSelectorTo === null
                        ? 'Select node'
                        : nodeSelectorTo.x + ',' + nodeSelectorTo.y},"
                    options={nodes.map((v) => ({
                        val: v,
                        text: `${v.x}, ${v.y}`,
                    }))}
                    onclick={(n: pos) => (nodeSelectorTo = n)}
                />
            </div>
        </div>
        <input
            type="number"
            min="0"
            bind:value={editingWaypoint.angle}
            placeholder="angle"
        />
        <div>
            <button
                type="button"
                class="btn btn-primary my-2"
                onclick={() => {
                    editingWaypoint = null;
                }}>Done</button
            >
        </div>
    {:else if isCreating && newWaypoint}
        <h3 class="py-2 mb-0">New Waypoint</h3>
        <div class="newWaypointWrapper py-2 px-3">
            <div class="row">
                <div class="col">
                    <input
                        type="number"
                        min="0"
                        bind:value={newWaypoint.y}
                        placeholder="x"
                        class="form-control my-1"
                    />
                </div>
                <div class="col">
                    <input
                        type="number"
                        min="0"
                        bind:value={newWaypoint.x}
                        placeholder="y"
                        class="form-control my-1"
                    />
                </div>
            </div>
            <div>
                <button
                    type="button"
                    class="btn btn-primary my-2"
                    onclick={confirmNewNode}
                    disabled={newWaypoint.x > 0 && newWaypoint.y > 0}
                    >Done</button
                >
            </div>
        </div>
    {/if}
</div>

<div class="bottom">
    <Saver {waypoints} bind:saveName bind:saveSelector bind:saves />
    <Loader {saveName} bind:saveSelector {saves} />
</div>

<style>
    @font-face {
        font-family: "Ginto Bold";
        src: url("/fonts/Ginto Bold.ttf") format("truetype");
        font-weight: bold;
        font-style: normal;
    }

    h3 {
        color: rgb(255, 207, 88);
        font-family: "Ginto Bold", sans-serif;
    }

    .col-fixed {
        width: 90px; /* adjust based on your data */
        font-variant-numeric: tabular-nums; /* keeps numbers aligned nicely */
    }

    .col-arrow {
        width: 40px;
        text-align: center;
    }

    .col-angle {
        width: 45px;
    }

    .col-actions {
        flex: 1;
    }

    .innerWaypointwrapper,
    .newWaypointWrapper {
        border: rgb(101, 88, 69);
        border-width: 1px;
        border-style: solid;
        background-color: rgb(61, 47, 33);
        border-radius: 16px;
    }

    /* not actually global because the class name gets transformed on build */
    /* TODO, fix animations playing on svg hover rather than on svg hover ideally */
    :global(.icon:hover) {
        color: #794f36;
        animation: fa-shake 0.8s ease;
    }
    :global(.icon) {
        color: rgb(240, 223, 194);
    }

    :global(.iconSecondary) {
        color: #685247;
    }
    :global(.iconSecondary:hover) {
        color: #794f36;
        animation: fa-shake 0.8s ease;
    }

    @keyframes fa-shake {
        0% {
            transform: rotate(0);
        }
        25% {
            transform: rotate(10deg);
        }
        50% {
            transform: rotate(-10deg);
        }
        75% {
            transform: rotate(6deg);
        }
        100% {
            transform: rotate(0);
        }
    }
</style>
