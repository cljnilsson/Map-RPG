<script lang="ts">
    import { bezier, getControlPoint, type pos } from "$lib/utils/math";
    import InfoPanel from "$lib/components/travel/infoPanel.svelte";
    import { getWaypoints } from "$lib/api/waypoint.remote";
    import { onMount } from "svelte";
    import WaypointController from "$lib/controller/waypoints.svelte";
    import Travel from "$lib/components/travel/travel.svelte";
    import type { WaypointPathCollection } from "$lib/types/waypoint";

    let editMode: boolean = $state(false);
    let currentlyDragged: number | null = $state(null);
    let saveName: string = $state("");
    let time: number = $state(1000);
    let saves: string[] = $state([
        "Test1",
        "Winterfell to Capital",
        "Wilderness to Winterfell",
    ]);
    let saveSelector: string = $state("Select Save");

    let animating = $state(false);

    function smoothstep(t: number) {
        return t * t * (3 - 2 * t);
    }

    function move(totalDurationMs = 5 * 1000) {
        if (animating || WaypointController.waypoints.length === 0) return;

        animating = true;

        let segmentIndex = 0;
        let t = 0;

        WaypointController.currentPos = {
            ...WaypointController.waypoints[0].from,
        };

        // Precompute control points
        const controls = WaypointController.waypoints.map((w) =>
            getControlPoint(w.from, w.to, w.angle),
        );

        // Simple distance helper
        function distance(a: pos, b: pos) {
            return Math.hypot(b.x - a.x, b.y - a.y);
        }

        // Length of each segment
        const segmentLengths = WaypointController.waypoints.map((w) =>
            distance(w.from, w.to),
        );

        // Total path length
        const totalLength = segmentLengths.reduce((a, b) => a + b, 0);

        let lastTime = performance.now();

        function step(now: number) {
            const dt = now - lastTime;
            lastTime = now;

            const segment = WaypointController.waypoints[segmentIndex];
            const segmentLength = segmentLengths[segmentIndex];

            // Portion of total duration this segment should consume
            const segmentDuration =
                (segmentLength / totalLength) * totalDurationMs;

            // Advance t based on real elapsed time
            t += dt / segmentDuration;

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

    function setTestData() {
        WaypointController.nodes = [
            { x: 50, y: 50 },
            { x: 150, y: 150 },
            { x: 500, y: 500 },
            { x: 300, y: 200 },
        ];
        WaypointController.waypoints = [
            {
                from: WaypointController.nodes[0],
                to: WaypointController.nodes[1],
                angle: 0.3,
            },
            {
                from: WaypointController.nodes[1],
                to: WaypointController.nodes[2],
                angle: 0.5,
            },
            {
                from: WaypointController.nodes[2],
                to: WaypointController.nodes[3],
                angle: 0.7,
            },
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

    onMount(async () => {
        const test = false;
        if (test) {
            setTestData();
        } else {
            WaypointController.loadInitFromServer();
        }
    });
</script>

<div class="row">
    <div class="col-auto">
        <Travel bind:currentlyDragged {editMode} />
    </div>

    <div class="col-3 info d-flex flex-column">
        {#if !!WaypointController.currentWaypointParent}
            <InfoPanel
                {currentlyDragged}
                bind:saveName
                bind:saveSelector
                bind:saves
                bind:time
            />
        {:else}
            <h5 class="text-center py-3">No waypoints exist</h5>
        {/if}
    </div>
</div>

<button type="button" onclick={() => move()}>Test Movement</button>

<button type="button" onclick={() => (editMode = !editMode)}>
    Editmode is {editMode ? "on" : "off"}
</button>

<button type="button" onclick={unload}>Reset</button>

<style lang="scss">
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
