<script lang="ts">
    import type { pos } from "$lib/utils/math";
    import type { Path } from "$lib/types/waypoint";
    import Dropdown from "$lib/components/travel/generic/dropdown.svelte";
    import WaypointController from "$lib/controller/waypoints.svelte";

    let {
        editingWaypoint = $bindable(),
        nodeSelectorFrom = $bindable(),
        nodeSelectorTo = $bindable(),
    }: {
        editingWaypoint: Path | null;
        nodeSelectorFrom: pos | null;
        nodeSelectorTo: pos | null;
    } = $props();
</script>

<h3 class="py-2 mb-0">Editing Waypoint</h3>
{#if !!editingWaypoint}
    <div class="row py-2">
        <div class="col-auto">
            <Dropdown
                text="{nodeSelectorFrom === null
                    ? 'Select node'
                    : nodeSelectorFrom.x + ',' + nodeSelectorFrom.y},"
                options={WaypointController.nodes.map((v) => ({
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
                options={WaypointController.nodes.map((v) => ({
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
{/if}
