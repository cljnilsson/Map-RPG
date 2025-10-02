<script lang="ts">
	import SettingsController from "$lib/controller/settings.svelte";
	import KeyBinder from "$lib/components/utils/keybind.svelte";

	// this might need to be derived
	let settings: { name: string; value: boolean | string; description: string }[] = [
		{ name: "Keybinds", value: SettingsController.keybindTooltips, description: "Show keybinds in the UI" },
		{ name: "Offline Mode", value: SettingsController.offlineMode, description: "Don't attempt to save data in the database" },
		{ name: "Dark Mode", value: SettingsController.darkMode, description: "Enable dark mode" },
		{ name: "Inventory Keybind", value: SettingsController.inventoryKeybind, description: "Keybind to open the inventory window" }
	];
</script>

<div class="map-wrapper mt-3 container">
	<h4>Settings</h4>
	{#each settings as s (s.name)}
		<div class="row">
			<div class="col">
				<span>{s.name}</span>
			</div>
			<div class="col">
				{#if typeof s.value === "string"}
					<KeyBinder bind:keybind={s.value} />
				{:else}
					<div class="form-check form-switch">
						<input class="form-check-input" type="checkbox" role="switch" id={"flexSwitchCheck" + s.name} checked={s.value} />
						<label class="form-check-label" for={"flexSwitchCheck" + s.name}>{s.description}</label>
					</div>
				{/if}
			</div>
		</div>
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
