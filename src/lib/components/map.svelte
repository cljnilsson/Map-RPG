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

<img src={state.map?.imagePath} alt="test" />
{#each state.contains as rect}
    <div
        class="overlay-rect"
        type="button"
        role="button"
        tabindex="1"
        style="
            left: {rect.clickBox.x}px;
            top: {rect.clickBox.y}px;
            width: {rect.clickBox.width}px;
            height: {rect.clickBox.height}px;
        "
        onclick={() => handleClick(rect)}
    ></div>
{/each}

<style>
	.overlay-rect {
		position: absolute;
		border: 2px solid red;
		background-color: rgba(255, 0, 0, 0.2);
		cursor: pointer;
	}
</style>