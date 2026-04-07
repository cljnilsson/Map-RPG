<script lang="ts">
    import { getControlPoint, type pos } from "$lib/utils/math";

    let { angle, from, to }: { angle: number; from: pos; to: pos } = $props();
</script>

<svg class="overlay">
    <title>line between points</title>
    <path
        d={`M ${from.x} ${from.y} Q ${getControlPoint(from, to, angle).x} ${getControlPoint(from, to, angle).y} ${to.x} ${to.y}`}
        stroke="black"
        fill="transparent"
    />
</svg>

<style>
    .overlay {
        position: absolute;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
</style>
