<script lang="ts">
    import type { pos } from "$lib/utils/math";
    import ActionButtons from "$lib/components/travel/actionButtons.svelte";

    type path = {
        from: pos;
        to: pos;
        angle: number;
    };

    let {
        w,
        i,
        currentlyDragged,
        onRemove,
        onEdit,
    }: {
        w: path;
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
    <div class="col-arrow g-0">=></div>
    <div class="col-fixed">
        {Math.round(w.to.x)},
        {Math.round(w.to.y)}
    </div>
    <div class="col-angle g-0">
        {w.angle}
    </div>
    <ActionButtons {w} {onRemove} {onEdit} />
</div>

<style>
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
</style>
