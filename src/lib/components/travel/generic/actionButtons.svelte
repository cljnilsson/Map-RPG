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
    >
        <FontAwesomeIcon icon={faPenToSquare} class="icon" />
    </button>
    <button
        type="button"
        onclick={() => {
            onRemove(w);
        }}
        class="icon-btn p-0"
    >
        <FontAwesomeIcon icon={faCircleMinus} class="icon" />
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
