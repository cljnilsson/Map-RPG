<script lang="ts">
    import type { pos } from "$lib/utils/math";
    import { saveWaypoint } from "$lib/api/waypoint.remote";
    let {
        waypoints,
        angles,
        currentlyDragged,
        saves = $bindable(),
        saveName = $bindable(),
        saveSelector = $bindable(),
    }: {
        waypoints: pos[];
        saveName: string;
        saves: string[];
        saveSelector: string;
        angles: number[];
        currentlyDragged: number | null;
    } = $props();

    function onLoad() {
        console.log("Tries to load");
    }

    async function onSave() {
        console.log("Tries to save", saveName);
        // FRESH! always makes new, never updates (for now)
        const result = await saveWaypoint({
            name: saveName,
            paths: [
                {
                    angle: angles[0],
                    from: waypoints[0],
                    to: waypoints[1],
                },
                {
                    angle: angles[1],
                    from: waypoints[1],
                    to: waypoints[2],
                },
            ],
        });

        if (result) {
            console.log("Save went well");
        } else {
            console.warn("All did not go well");
        }
    }
</script>

{#each waypoints as w, i}
    <p class="my-2" class:fw-bold={i === currentlyDragged}>
        {w.x}
        {w.y}
        {angles[i]}
    </p>
{/each}
<div class="mt-3 mb-2 row">
    <div class="col">
        <button
            type="button"
            class="btn btn-primary"
            onclick={onSave}
            disabled={!saveName || saveName.length === 0}>Save Current</button
        >
    </div>
    <div class="col">
        <input
            class="form-control"
            bind:value={saveName}
            placeholder="Save name"
        />
    </div>
</div>
<div class="mt-3 mb-2 row">
    <div class="col">
        <button
            type="button"
            class="btn btn-primary"
            // Change later so saveName can be null and default value can be Select Save
            disabled={saveName === "Select Save"}
            onclick={onLoad}>Load</button
        >
    </div>
    <div class="col">
        <div class="dropdown">
            <button
                class="btn btn-primary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {saveSelector}
            </button>
            <ul class="dropdown-menu">
                {#each saves as s}
                    <li>
                        <a
                            class="dropdown-item"
                            href="#"
                            onclick={() => (saveSelector = s)}>{s}</a
                        >
                    </li>
                {/each}
            </ul>
        </div>
    </div>
</div>

<style>
</style>
