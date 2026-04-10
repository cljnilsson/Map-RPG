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
        nodes,
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
    let nodeSelectorFrom: pos | null = $state(null);
    let nodeSelectorTo: pos | null = $state(null);
    let error: string = $state("");

    function onRemove(p: path) {
        //
    }
    function onEdit(p: path) {
        console.log(":D");
        editingWaypoint = p;
    }
</script>

<div class="waypoints flex-grow-1">
    <h3 class="py-2 mb-0">Editor</h3>
    {#if error.length > 0}
        <div class="alert alert-danger my-2" role="alert">
            A simple danger alert—check it out!
        </div>
    {/if}
    <div class="innerWaypointwrapper px-3 py-2">
        {#each waypoints as w, i}
            <div class="row my-1" class:fw-boldd={i === currentlyDragged}>
                <div class="col-2">
                    {w.from.x},
                    {w.from.y}
                </div>
                <div class="col-auto">=></div>
                <div class="col-auto">
                    {w.to.x},
                    {w.to.y}
                </div>
                <div class="col-auto">
                    {w.angle}
                </div>
                <div class="col">
                    <button
                        type="button"
                        onclick={() => {
                            onEdit(w);
                        }}
                        class="icon-btn"
                    >
                        <FontAwesomeIcon icon={faPenToSquare} class="icon" />
                    </button>
                    <button
                        type="button"
                        onclick={() => {
                            onRemove(w);
                        }}
                        class="icon-btn"
                    >
                        <FontAwesomeIcon icon={faCircleMinus} class="icon" />
                    </button>
                </div>
            </div>
        {/each}
    </div>
    {#if editingWaypoint}
        <div class="row py-2">
            <div class="col-auto">
                <div class="dropdown">
                    <button
                        class="btn btn-sm btn-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {nodeSelectorFrom === null
                            ? "Select node"
                            : nodeSelectorFrom.x + "," + nodeSelectorFrom.y}
                    </button>
                    <ul class="dropdown-menu">
                        {#each nodes as n}
                            <li>
                                <a
                                    class="dropdown-item"
                                    href="#"
                                    onclick={() => (nodeSelectorFrom = n)}
                                    >{n.x + "," + n.y}</a
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
            </div>
            <div class="col">
                <div class="dropdown">
                    <button
                        class="btn btn-sm btn-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        {nodeSelectorTo === null
                            ? "Select node"
                            : nodeSelectorTo.x + "," + nodeSelectorTo.y}
                    </button>
                    <ul class="dropdown-menu">
                        {#each nodes as n}
                            <li>
                                <a
                                    class="dropdown-item"
                                    href="#"
                                    onclick={() => (nodeSelectorTo = n)}
                                    >{n.x + "," + n.y}</a
                                >
                            </li>
                        {/each}
                    </ul>
                </div>
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
    {/if}
</div>

<div class="bottom">
    <Saver {waypoints} bind:saveName bind:saveSelector bind:saves />
    <Loader {saveName} bind:saveSelector {saves} />
</div>

<style>
    h3 {
        color: rgb(255, 207, 88);
        text-weight: bold;
    }

    .innerWaypointwrapper {
        border: rgb(101, 88, 69);
        border-width: 1px;
        border-style: solid;
        background-color: rgb(61, 47, 33);
        border-radius: 16px;
    }

    .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
    }

    /* not actually global because the class name gets transformed on build */
    :global(.icon:hover) {
        color: #794f36;
        animation: fa-shake 0.8s ease;
    }
    :global(.icon) {
        color: rgb(240, 223, 194);
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
