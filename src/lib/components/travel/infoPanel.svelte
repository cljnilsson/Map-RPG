<script lang="ts">
    import type { pos } from "$lib/utils/math";
    import Saver from "$lib/components/travel/saver.svelte";
    import Loader from "$lib/components/travel/loader.svelte";
    import {
        faPlus,
        faMinus,
        faCircle,
    } from "@fortawesome/free-solid-svg-icons";
    import { faCircle as regFaCircle } from "@fortawesome/free-regular-svg-icons";
    import WaypointViewerFull from "$lib/components/travel/partials/waypointViewer.svelte";
    import WaypointViewerCompact from "$lib/components/travel/partials/waypointViewerCompact.svelte";
    import PathEditor from "$lib/components/travel/edit.svelte";
    import NodeCreator from "$lib/components/travel/create.svelte";
    import PathHeader from "$lib/components/travel/partials/pathHeader.svelte";
    import IconButton from "$lib/components/travel/generic/iconButton.svelte";
    import { removePath } from "$lib/api/waypoint.remote";
    import Dropdown from "$lib/components/travel/generic/dropdown.svelte";
    import type { WaypointPathCollection } from "$lib/types/waypoint";

    type path = {
        from: pos;
        to: pos;
        angle: number;
    };

    let {
        waypoints = $bindable(),
        currentWaypointParent = $bindable(),
        currentPos = $bindable(),
        currentlyDragged,
        waypointPathCollection,
        nodes = $bindable(),
        saves = $bindable(),
        saveName = $bindable(),
        saveSelector = $bindable(),
    }: {
        waypoints: path[];
        currentPos: pos | undefined;
        saveName: string;
        currentWaypointParent: {
            id: number;
            name: string;
        };
        waypointPathCollection: WaypointPathCollection[];
        saves: string[];
        saveSelector: string;
        currentlyDragged: number | null;
        nodes: pos[];
    } = $props();

    // TODO, add scrollwheel to modify angle
    // change from and to from each path with dropdown
    // Visual indicator for what is currently being edited
    // Angle sould be between -1 and 1

    let editingWaypoint: path | null = $state(null);
    let newWaypoint: pos | null = $state(null);
    let isCreating: boolean = $state(false);
    let viewFull: boolean = $state(true);
    let nodeSelectorFrom: pos | null = $state(null);
    let nodeSelectorTo: pos | null = $state(null);
    let error: string = $state("");

    function onRemove(p: path) {
        waypoints = waypoints.filter(
            (w) => !(w.angle === p.angle && w.from === p.from && w.to === p.to),
        );

        // Should do this first ideally but it works for now
        removePath({
            ...p,
            parentId: currentWaypointParent.id,
        });
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

    function onChangeCollection(val: string) {
        console.log("clicked on", val);
        currentWaypointParent = waypointPathCollection.filter(
            (v) => v.name === val,
        )[0];
        nodes = [
            { x: 50, y: 50 },
            { x: 150, y: 150 },
            { x: 500, y: 500 },
            { x: 300, y: 200 },
        ];
        waypoints = [
            { from: nodes[0], to: nodes[1], angle: 0.3 },
            { from: nodes[1], to: nodes[2], angle: 0.5 },
            { from: nodes[2], to: nodes[3], angle: 0.7 },
        ];

        currentPos = { ...waypoints[0].from };
    }
</script>

<div class="waypoints flex-grow-1">
    <h3 class="py-2 mb-0">Editor</h3>
    <div class="row align-items-center">
        <div class="col-8 my-2">
            <h5 class="my-0">
                Editing: {currentWaypointParent.name} ({currentWaypointParent.id})
            </h5>
        </div>
        <div class="col text-end my-2">
            <Dropdown
                options={waypointPathCollection.map((v) => {
                    return {
                        text: `${v.name} (${v.paths.length})`,
                        val: v.name,
                    };
                })}
                text={"Pick Collection"}
                onclick={onChangeCollection}
            />
        </div>
    </div>
    {#if error.length > 0}
        <div class="alert alert-danger my-2" role="alert">
            {error}
        </div>
    {/if}
    <div class="innerWaypointwrapper px-3 py-2">
        <PathHeader {viewFull} />
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
    {#if isCreating}
        <IconButton onClick={onAddFresh} extraClasses="my-2" icon={faMinus} />
    {:else}
        <IconButton onClick={onAddFresh} extraClasses="my-2" icon={faPlus} />
    {/if}
    {#if viewFull}
        <IconButton
            onClick={() => (viewFull = !viewFull)}
            extraClasses="my-2"
            icon={faCircle}
        />
    {:else}
        <IconButton
            onClick={() => (viewFull = !viewFull)}
            extraClasses="my-2"
            icon={regFaCircle}
        />
    {/if}
    {#if editingWaypoint}
        <PathEditor
            {nodes}
            bind:editingWaypoint
            bind:nodeSelectorFrom
            bind:nodeSelectorTo
        />
    {:else if isCreating && newWaypoint}
        <NodeCreator bind:nodes bind:waypoints bind:newNode={newWaypoint} />
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

    .innerWaypointwrapper {
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
