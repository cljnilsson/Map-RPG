<script lang="ts">
    import Draggable from "$lib/utils/Draggable.svelte";
    let {
        x = $bindable(),
        y = $bindable(),
        extraClasses,
        editMode,
        currentlyDragged = $bindable(),
        index,
    }: {
        x: number;
        y: number;
        extraClasses: string;
        editMode: boolean;
        currentlyDragged: number | null;
        index: number;
    } = $props();
</script>

{#if editMode}
    <Draggable
        locked={false}
        bind:x
        bind:y
        {editMode}
        containerWrapper=".travel"
        onDragStart={() => {
            currentlyDragged = index; //Ugly but I just want it to work right now
            console.log(index);
        }}
        onDragEnd={(wasDragged: boolean) => {
            if (!wasDragged) {
                return;
            }
            currentlyDragged = null;
        }}
    >
        <span
            class={`point ${extraClasses}`}
            class:dragging={index === currentlyDragged}
        ></span>
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

    .dragging {
        background-color: teal !important;
        border-color: black;
        border-width: 2px;
        border-style: solid;
    }

    .target {
        background-color: yellow;
    }
</style>
