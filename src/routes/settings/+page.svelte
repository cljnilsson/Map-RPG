<script lang="ts">
    let settings: {name: string, value: boolean, description: string}[] = [
        {name: "Keybinds", value: true, description: "Show keybinds in the UI"}
    ];
</script>

<div class="map-wrapper mt-3 container">
    <h4>Settings</h4>
    {#each settings as s}
        <div>{s.name} {s.value}</div>
    {/each}
</div>

<style>
	.map-wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>