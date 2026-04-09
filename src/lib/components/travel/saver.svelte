<script lang="ts">
    import type { pos } from "$lib/utils/math";
    import { saveWaypoint } from "$lib/api/waypoint.remote";

    type path = {
        from: pos;
        to: pos;
        angle: number;
    };

    let {
        waypoints,
        saves = $bindable(),
        saveName = $bindable(),
        saveSelector = $bindable(),
    }: {
        waypoints: path[];
        saveName: string;
        saves: string[];
        saveSelector: string;
    } = $props();

    async function onSave() {
        console.log("Tries to save", saveName);
        // FRESH! always makes new, never updates (for now)
        const result = await saveWaypoint({
            name: saveName,
            paths: waypoints,
        });

        if (result) {
            console.log("Save went well");
        } else {
            console.warn("All did not go well");
        }
    }
</script>

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
