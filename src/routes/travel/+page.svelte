<script lang="ts">
    import { bezier, getControlPoint, type pos } from "$lib/utils/math";
    import Line from "$lib/components/line.svelte";
    import Point from "$lib/components/travel/point.svelte";
    import InfoPanel from "$lib/components/travel/infoPanel.svelte";
    import { getWaypoints } from "$lib/api/waypoint.remote";
    import { onMount } from "svelte";

    type path = {
        from: pos;
        to: pos;
        angle: number;
    };

    // needs to be shared object to update both connected lines from a node
    let nodes: pos[] = $state([
        { x: 50, y: 50 },
        { x: 150, y: 150 },
        { x: 500, y: 500 },
        { x: 300, y: 200 },
    ]);
    let waypoints: path[] = $state([
        { from: nodes[0], to: nodes[1], angle: 0.3 },
        { from: nodes[1], to: nodes[2], angle: 0.5 },
        { from: nodes[2], to: nodes[3], angle: 0.7 },
    ]);
    console.log("paths are valid", validateJoinedNodes(waypoints));
    let currentPos: pos = $state({ ...waypoints[0].from });
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

    function validateJoinedNodes(toCheck: path[], epsilon = 0.001): boolean {
        if (toCheck.length <= 1) return true;

        function isClose(a: number, b: number) {
            return Math.abs(a - b) < epsilon;
        }

        for (let i = 0; i < toCheck.length - 1; i++) {
            const current = toCheck[i];
            const next = toCheck[i + 1];

            const xMatch = isClose(current.to.x, next.from.x);
            const yMatch = isClose(current.to.y, next.from.y);

            if (!xMatch || !yMatch) {
                return false;
            }
        }

        return true;
    }

    function move() {
        if (animating || waypoints.length === 0) return;

        animating = true;

        let segmentIndex = 0;
        let t = 0;
        const speed = 0.02;

        currentPos = { ...waypoints[0].from };

        // Precompute control points (performance + clarity)
        const controls = waypoints.map((w) =>
            getControlPoint(w.from, w.to, w.angle),
        );

        let lastTime = performance.now();

        function step(now: number) {
            const dt = (now - lastTime) / 16; // normalize ~60fps
            const segment = waypoints[segmentIndex];

            lastTime = now;
            t += speed * dt;

            if (t >= 1) {
                segmentIndex++;

                if (segmentIndex >= waypoints.length) {
                    animating = false;
                    return;
                }

                t = 0;
                requestAnimationFrame(step);
                return;
            }

            const eased = smoothstep(t);

            currentPos = bezier(
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
        waypoints = [];
        editMode = false;
        currentlyDragged = null;
    }

    onMount(async () => {
        const data = await getWaypoints();
        console.log("Waypoints", data);
    });
</script>

<div class="row">
    <div class="col-auto">
        <div class="travel">
            {#if waypoints.length > 0}
                <!-- Moving point -->
                <Point
                    bind:x={currentPos.x}
                    bind:y={currentPos.y}
                    extraClasses=""
                    {editMode}
                    bind:currentlyDragged
                    index={-1}
                />

                {#each waypoints as w, i}
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
                    {#if i === waypoints.length - 1}
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
        <InfoPanel
            {waypoints}
            {currentlyDragged}
            {nodes}
            bind:saveName
            bind:saveSelector
            bind:saves
        />
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
