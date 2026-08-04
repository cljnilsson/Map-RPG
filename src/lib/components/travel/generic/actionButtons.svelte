<script lang="ts">
    import type { pos } from "$lib/utils/math";

    type path = {
        from: pos;
        to: pos;
        angle: number;
    };

    let {
        w,
        onRemove,
        onEdit,
    }: {
        w: path;
        onRemove: (w: path) => void;
        onEdit: (w: path) => void;
    } = $props();
</script>

<div class="col-actions">
    <button
        type="button"
        onclick={() => {
            onEdit(w);
        }}
        class="icon-btn p-0"
        aria-label="Edit path"
    >
        <img src="/icons/font-awesome/pen-to-square.svg" alt="" aria-hidden="true" class="icon" />
    </button>
    <button
        type="button"
        onclick={() => {
            onRemove(w);
        }}
        class="icon-btn p-0"
        aria-label="Remove path"
    >
        <img src="/icons/font-awesome/circle-minus.svg" alt="" aria-hidden="true" class="icon" />
    </button>
</div>

<style>
    .col-actions {
        flex: 1;
    }

    .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
    }
</style>
