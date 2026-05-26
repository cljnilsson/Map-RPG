<script lang="ts">
    import Draggable from "$lib/utils/Draggable.svelte";
    let {
        x = $bindable(),
        y = $bindable(),
        extraClasses,
        editMode,
        currentlyDragged = $bindable(),
        index,
        imagePath,
    }: {
        x: number;
        y: number;
        extraClasses: string;
        editMode: boolean;
        currentlyDragged: number | null;
        index: number;
        imagePath?: string;
    } = $props();
</script>

{#if editMode}
    <Draggable
        locked={false}
        bind:x
        bind:y
        {editMode}
        containerWrapper=".travel"
        onDrag={(newX: number, newY: number) => {}}
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
            class:colored={!imagePath}
            style:background-image={imagePath
                ? `url("${imagePath}")`
                : undefined}
        ></span>
    </Draggable>
{:else}
    <span
        class={`point ${extraClasses}`}
        class:colored={!imagePath}
        style:background-image={imagePath ? `url("${imagePath}")` : undefined}
        style="left: {x}px; top: {y}px;"
    ></span>
{/if}

<style>
    .point {
        position: absolute;
        width: 48px;
        height: 48px;
        /*background-color: white;*/
        border-radius: 24px;
        transform: translate(-50%, -50%);
        background-size: cover;
        background-repeat: no-repeat;
        z-index: 110;
    }

    .colored {
        background-color: white;
        background-image: none;
    }

    .dragging {
        background-color: teal !important;
        border-color: black;
        border-width: 2px;
        border-style: solid;
    }

    .target {
        background-color: yellow;
        width: 32px;
        height: 32px;
        border-radius: 16px;
        background-image: none;
        z-index: 100;
    }
</style>
