<script lang="ts">
    import Tooltip from "$lib/features/tooltip/tooltipOnHover.svelte";
    import InventorySplitter from "$lib/features/window/windows/inventory/inventorySplitter.svelte";
    import WindowController from "$lib/controller/window.svelte";
    import { now } from "$lib/api/server.remote";
    import dayjs from "dayjs";
    import { Tween } from "svelte/motion";
    import { cubicOut, linear } from "svelte/easing";
    import { tick, onMount } from "svelte";

    let inventoryWindow = WindowController.getByName("InventorySplitter");

    function openSplitter(e: MouseEvent) {
        inventoryWindow.visible = true;
        inventoryWindow.x = e.clientX + 10;
        inventoryWindow.y = e.clientY + 10;
    }

    let timestamp = $state(0);
    let nextUpdate = $state(0);
    let initialRemaining = $state(0);
    let currentTime = $state(Date.now());

    setInterval(() => {
        currentTime = Date.now();
    }, 50);

    const progress = $derived.by(() => {
        if (!nextUpdate) return 0;

        const remaining = nextUpdate - currentTime;
        //console.log(Math.round(100 - (remaining / initialRemaining) * 100));

        return Math.round(100 - (remaining / initialRemaining) * 100);
    });

    const nextUpdateCountdown = $derived(
        Math.max(0, Math.ceil((nextUpdate - currentTime) / 1000)),
    );

    $effect(() => {
        now().then((result) => {
            nextUpdate = result.nextUpdate;
            timestamp = result.timestamp;
            initialRemaining = result.nextUpdate - Date.now();
        });
    });
</script>

<div class="px-5 py-5">
    <div class="row justify-content-center">
        <div class="col-auto bg-light">
            <p>
                the time is {dayjs(timestamp).format("HH:mm:ss")} next update is in
                {nextUpdateCountdown} seconds
            </p>
            <progress class="w-100" max="100" value={progress}
                >{progress}%</progress
            >
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-auto">
            <Tooltip>
                <div class="demo"></div>
                {#snippet onHoverTooltip()}
                    <h3>Title</h3>
                    <p>Text</p>
                    <div class="border-top py-1">
                        <p class="my-1">
                            <span class="badge text-bg-secondary"
                                >Left Click</span
                            >: <b>Highlight</b>
                        </p>
                        <p class="my-1">
                            <span class="badge text-bg-secondary"
                                >Right Click</span
                            >: <b>Use / Sell</b>
                        </p>
                        <p class="my-1">
                            <span class="badge text-bg-secondary">Shift</span> +
                            <span class="badge text-bg-secondary"
                                >Left Click</span
                            >:
                            <b>Split</b>
                        </p>
                    </div>
                {/snippet}
            </Tooltip>
        </div>
    </div>
</div>
<div class="px-5 py-5">
    <div class="row justify-content-center">
        <div class="col-auto">
            <Tooltip disable={inventoryWindow.visible}>
                <div class="demo" onclick={openSplitter}>click me</div>
                {#snippet onHoverTooltip()}
                    <h3>Title</h3>
                    <p>Text</p>
                    <div class="border-top py-1">
                        <p class="my-1">
                            <span class="badge text-bg-secondary"
                                >Left Click</span
                            >: <b>Highlight</b>
                        </p>
                        <p class="my-1">
                            <span class="badge text-bg-secondary"
                                >Right Click</span
                            >: <b>Use / Sell</b>
                        </p>
                        <p class="my-1">
                            <span class="badge text-bg-secondary">Shift</span> +
                            <span class="badge text-bg-secondary"
                                >Left Click</span
                            >:
                            <b>Split</b>
                        </p>
                    </div>
                {/snippet}
            </Tooltip>
        </div>
    </div>
</div>
<InventorySplitter min={1} max={14} />

<style>
    .demo {
        width: 100px;
        height: 100px;
        background-color: red;
    }
</style>
