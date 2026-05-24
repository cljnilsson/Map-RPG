<script lang="ts">
    import { bezier, getControlPoint, type pos } from "$lib/utils/math";
    import Line from "$lib/components/line.svelte";
    import Point from "$lib/components/travel/point.svelte";
    import InfoPanel from "$lib/components/travel/infoPanel.svelte";
    import { getWaypoints } from "$lib/api/waypoint.remote";
    import { onMount } from "svelte";
    import WaypointController from "$lib/controller/waypoints.svelte";
    import type { WaypointPathCollection } from "$lib/types/waypoint";

    let {
        editMode,
        currentlyDragged = $bindable(),
    }: { editMode: boolean; currentlyDragged: number | null } = $props();
</script>

<div class="travel">
    {#if WaypointController.waypoints.length > 0 && WaypointController.currentPos}
        <!-- Moving point -->
        <Point
            bind:x={WaypointController.currentPos.x}
            bind:y={WaypointController.currentPos.y}
            extraClasses=""
            {editMode}
            bind:currentlyDragged
            index={-1}
        />

        {#each WaypointController.waypoints as w, i}
            <!-- Path line -->
            <Line from={w.from} to={w.to} angle={w.angle} />

            <!-- Start point -->
            <Point
                bind:x={w.from.x}
                bind:y={w.from.y}
                extraClasses="target"
                {editMode}
                bind:currentlyDragged
                index={i}
            />

            <!-- End point (only last segment) -->
            {#if i === WaypointController.waypoints.length - 1}
                <Point
                    bind:x={w.to.x}
                    bind:y={w.to.y}
                    extraClasses="target"
                    {editMode}
                    bind:currentlyDragged
                    index={i}
                />
            {/if}
        {/each}
    {/if}
</div>

<style lang="scss">
    .travel {
        position: relative;
        width: 1000px;
        height: 800px;
        background-color: red;
        overflow: hidden;
    }
</style>
