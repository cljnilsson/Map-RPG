<script lang="ts">
    import { bezier, getControlPoint, type pos } from "$lib/utils/math";
    import Line from "$lib/components/line.svelte";
    import Point from "$lib/components/travel/point.svelte";

    let from: pos = $state({ x: 50, y: 50 });
    let start: pos = { x: 50, y: 50 };
    let waypoints: pos[] = $state([
        { x: 150, y: 150 },
        { x: 500, y: 500 },
        { x: 300, y: 200 },
    ]);
    let editMode: boolean = $state(false);

    let angle: number = $state(0.3); // curvature strength
    let animating = false;

    function move() {
        if (animating || waypoints.length === 0) return;

        animating = true;

        let segmentIndex = 0;
        let currentStart = { ...from };
        let currentEnd = waypoints[segmentIndex];
        let control = getControlPoint(currentStart, currentEnd, angle);
        let t = 0;

        function nextSegment() {
            segmentIndex++;

            if (segmentIndex >= waypoints.length) {
                animating = false;
                from = { ...currentEnd };
                return;
            }

            currentStart = { ...currentEnd };
            currentEnd = waypoints[segmentIndex];
            control = getControlPoint(currentStart, currentEnd, angle);
            t = 0;

            requestAnimationFrame(step);
        }

        function step() {
            t += 0.02;

            if (t >= 1) {
                from = { ...currentEnd };
                nextSegment();
                return;
            }

            const eased = t * t * (3 - 2 * t);
            from = bezier(eased, currentStart, control, currentEnd);

            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }
</script>

<div class="travel">
    <Line from={start} to={waypoints[0]} {angle} />

    <Point bind:y={from.y} bind:x={from.x} extraClasses="" {editMode} />
    {#each waypoints as w, i}
        {#if i < waypoints.length - 1}
            <Line from={waypoints[i]} to={waypoints[i + 1]} {angle} />
        {/if}
        <Point bind:y={w.y} bind:x={w.x} extraClasses="target" {editMode} />
    {/each}
</div>

<button type="button" onclick={move}>Test Movement</button>
<button type="button" onclick={() => (editMode = !editMode)}
    >Editmode is {editMode ? "on" : "off"}</button
>

<style lang="scss">
    .travel {
        position: relative;
        width: 1000px;
        height: 800px;
        background-color: red;
        overflow: hidden;
    }
</style>
