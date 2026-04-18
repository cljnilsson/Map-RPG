<script lang="ts">
    import { bezier, getControlPoint, type pos } from "$lib/utils/math";
    import Line from "$lib/components/line.svelte";
    import Point from "$lib/components/travel/point.svelte";
    import InfoPanel from "$lib/components/travel/infoPanel.svelte";
    import { getWaypoints } from "$lib/api/waypoint.remote";
    import { onMount } from "svelte";
    import type { Path, WaypointPathCollection } from "$lib/types/waypoint";
    import WaypointController from "$lib/controller/waypoints.svelte";

    let waypointPathCollection: WaypointPathCollection[] = $state([]);

    // needs to be shared object to update both connected lines from a node
    let nodes: pos[] = $state([]);

    let editMode: boolean = $state(false);
    let saveName: string = $state("");
    let currentlyDragged: number | null = $state(null);
    let saves: string[] = $state([
        "Test1",
        "Winterfell to Capital",
        "Wilderness to Winterfell",
    ]);
    let saveSelector: string = $state("Select Save");

    let animating = false;

    function smoothstep(t: number) {
        return t * t * (3 - 2 * t);
    }

    function move() {
        if (animating || WaypointController.waypoints.length === 0) return;

        animating = true;

        let segmentIndex = 0;
        let t = 0;
        const speed = 0.02;

        WaypointController.currentPos = {
            ...WaypointController.waypoints[0].from,
        };

        // Precompute control points (performance + clarity)
        const controls = WaypointController.waypoints.map((w) =>
            getControlPoint(w.from, w.to, w.angle),
        );

        let lastTime = performance.now();

        function step(now: number) {
            const dt = (now - lastTime) / 16; // normalize ~60fps
            const segment = WaypointController.waypoints[segmentIndex];

            lastTime = now;
            t += speed * dt;

            if (t >= 1) {
                segmentIndex++;

                if (segmentIndex >= WaypointController.waypoints.length) {
                    animating = false;
                    return;
                }

                t = 0;
                requestAnimationFrame(step);
                return;
            }

            const eased = smoothstep(t);

            WaypointController.currentPos = bezier(
                eased,
                segment.from,
                controls[segmentIndex],
                segment.to,
            );

            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    function unload() {
        WaypointController.waypoints = [];
        editMode = false;
        currentlyDragged = null;
    }

    onMount(async () => {
        const test = true;
        if (test) {
            nodes = [
                { x: 50, y: 50 },
                { x: 150, y: 150 },
                { x: 500, y: 500 },
                { x: 300, y: 200 },
            ];
            WaypointController.waypoints = [
                { from: nodes[0], to: nodes[1], angle: 0.3 },
                { from: nodes[1], to: nodes[2], angle: 0.5 },
                { from: nodes[2], to: nodes[3], angle: 0.7 },
            ];
            WaypointController.currentPos = {
                ...WaypointController.waypoints[0].from,
            };
            console.log(
                "paths are valid (demo)",
                WaypointController.validateJoinedNodes(
                    WaypointController.waypoints,
                ),
            );
            WaypointController.currentWaypointParent = {
                id: 1,
                name: "not-real",
            };
        }
        const data = await getWaypoints();
        console.log("Waypoints", data);
        if (data) {
            waypointPathCollection = data;
            WaypointController.validateAllPathNodes(waypointPathCollection);
        }
    });
</script>

<div class="row">
    <div class="col-auto">
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
    </div>

    <div class="col-3 info d-flex flex-column">
        {#if !!WaypointController.currentWaypointParent}
            <InfoPanel
                {waypointPathCollection}
                {currentlyDragged}
                bind:nodes
                bind:saveName
                bind:saveSelector
                bind:saves
            />
        {/if}
    </div>
</div>

<button type="button" onclick={move}>Test Movement</button>

<button type="button" onclick={() => (editMode = !editMode)}>
    Editmode is {editMode ? "on" : "off"}
</button>

<button type="button" onclick={unload}>Reset</button>

<style lang="scss">
    .travel {
        position: relative;
        width: 1000px;
        height: 800px;
        background-color: red;
        overflow: hidden;
    }

    .info {
        /*background: rgba(0, 0, 0, 0.53);*/
        background: rgb(106, 95, 77);
        border-radius: 16px;
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        /*backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);*/
        border: 1px solid rgb(56, 47, 39);
        color: rgb(240, 223, 194);
    }
</style>
