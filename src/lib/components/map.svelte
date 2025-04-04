<script lang="ts">
    import type { MapWithClickBox, CustomMap } from "$lib/types/mapTypes";
    import { maps } from "$lib/tempData";

    export let state: CustomMap;

    function handleClick(rect: MapWithClickBox) {
        console.log(rect);

        const found = maps.find((map) => map.map?.name === rect.map.name);

        if(found) {
            state = found;
        }
	}
</script>

<img src={state.map?.imagePath} class={state.map.type} alt="test" />
{#each state.contains as rect}
    <button
        class="overlay-rect"
        type="button"
        style="
            left: {rect.clickBox.x}px;
            top: {rect.clickBox.y}px;
            width: {rect.clickBox.width}px;
            height: {rect.clickBox.height}px;
            transform: rotate({rect.clickBox.rotation}deg);
        "
        onclick={() => handleClick(rect)}
        onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick(rect)}
        aria-label={`Clickable area for ${rect.map.name}`}
    ></button>
{/each}

<style>
	.overlay-rect {
		position: absolute;
		border: 2px solid red;
		background-color: rgba(255, 0, 0, 0.2);
		cursor: pointer;
	}

    img.city, img.building {
        height: 93vh;
        width: 99vw;
    }
</style>