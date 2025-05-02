<script lang="ts">
    import CharacterAvatar from "$lib/components/character/CharacterAvatar.svelte";
	import WindowStore from '$lib/stores/windows.svelte';
	import MapStore from '$lib/stores/map.svelte';
</script>

<div class="position-fixed bottom-0 start-0 m-3">
	<div class="bg-light border rounded shadow py-2 row g-0">
		<div class="col px-2">
            <CharacterAvatar width={100} height={100} />
		</div>
		<div class="col px-2">
			{#if MapStore.currentMapState.map.type === "city"}
				<button class="btn btn-primary btn-sm d-block mb-2 w-100" onclick={() => WindowStore.unitVisibility = !WindowStore.unitVisibility}>Units</button>
			{/if}
			<button class="btn btn-secondary btn-sm d-block mb-2 w-100" onclick={() => WindowStore.navigationVisibility = !WindowStore.navigationVisibility}>Navigation</button>
			<button class="btn btn-danger btn-sm d-block w-100" onclick={() => WindowStore.loggerVisibility = !WindowStore.loggerVisibility}>Logs</button>
		</div>
	</div>
</div>