<script lang="ts">
    import type { pos } from "$lib/utils/math";

    type path = {
        from: pos;
        to: pos;
        angle: number;
    };

    let {
        nodes = $bindable(),
        waypoints = $bindable(),
        newNode = $bindable(),
    }: { nodes: pos[]; waypoints: path[]; newNode: pos } = $props();

    function confirmNewNode() {
        if (!newNode) {
            console.warn("Wops, should not be able to run this function.");
            return;
        }

        nodes = [
            ...nodes,
            {
                x: newNode.x,
                y: newNode.y,
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

<h3 class="py-2 mb-0">New Waypoint</h3>
<div class="newWaypointWrapper py-2 px-3">
    <div class="row">
        <div class="col">
            <input
                type="number"
                min="0"
                bind:value={newNode.y}
                placeholder="x"
                class="form-control my-1"
            />
        </div>
        <div class="col">
            <input
                type="number"
                min="0"
                bind:value={newNode.x}
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
            disabled={newNode.x > 0 && newNode.y > 0}>Done</button
        >
    </div>
</div>

<style>
    .newWaypointWrapper {
        border: rgb(101, 88, 69);
        border-width: 1px;
        border-style: solid;
        background-color: rgb(61, 47, 33);
        border-radius: 16px;
    }
</style>
