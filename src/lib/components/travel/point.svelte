<script lang="ts">
    import Draggable from "$lib/utils/Draggable.svelte";
    let {
        x = $bindable(),
        y = $bindable(),
        extraClasses,
        editMode,
    }: {
        x: number;
        y: number;
        extraClasses: string;
        editMode: boolean;
    } = $props();
</script>

{#if editMode}
    <Draggable
        locked={false}
        bind:x
        bind:y
        {editMode}
        containerWrapper=".travel"
        onDragStart={() => {}}
        onDragEnd={(wasDragged) => {}}
    >
        <span class={`point ${extraClasses}`}></span>
    </Draggable>
{:else}
    <span class={`point ${extraClasses}`} style="left: {x}px; top: {y}px;"
    ></span>
{/if}

<style>
    .point {
        position: absolute;
        width: 32px;
        height: 32px;
        background-color: white;
        border-radius: 16px;
        transform: translate(-50%, -50%);
    }

    .target {
        background-color: yellow;
    }
</style>
