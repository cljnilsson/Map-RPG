<script lang="ts">
    import type { pos } from "$lib/utils/math";
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
        w,
        waypoints,
        i,
        currentlyDragged,
        onRemove,
        onEdit,
    }: {
        w: path;
        waypoints: path[];
        i: number;
        currentlyDragged: number | null;
        onRemove: (w: path) => void;
        onEdit: (w: path) => void;
    } = $props();
</script>

<div class="row my-1" class:fw-bold={i === currentlyDragged}>
    <div class="col-fixed">
        {Math.round(w.from.x)},
        {Math.round(w.from.y)}
    </div>
    <div class="col-angle g-0">
        {w.angle}
    </div>
</div>
{#if i === waypoints.length - 1}
    <div class="row my-1" class:fw-bold={i === currentlyDragged}>
        <div class="col-fixed">
            {Math.round(w.to.x)},
            {Math.round(w.to.y)}
        </div>
    </div>
{/if}

<style>
    .col-fixed {
        width: 90px; /* adjust based on your data */
        font-variant-numeric: tabular-nums; /* keeps numbers aligned nicely */
    }

    .col-angle {
        width: 45px;
    }
</style>
