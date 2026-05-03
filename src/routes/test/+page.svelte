<script lang="ts">
    import Tooltip from "$lib/features/tooltip/tooltipOnHover.svelte";
    import InventorySplitter from "$lib/features/window/windows/inventory/inventorySplitter.svelte";
    import WindowController from "$lib/controller/window.svelte";
    import { now } from "$lib/api/server.remote";

    let inventoryWindow = WindowController.getByName("InventorySplitter");

    function openSplitter(e: MouseEvent) {
        inventoryWindow.visible = true;
        inventoryWindow.x = e.clientX + 10;
        inventoryWindow.y = e.clientY + 10;
    }
</script>

<div class="px-5 py-5">
    <div class="row justify-content-center">
        <div class="col-auto">
            <p>the time is {await now()}</p>
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
