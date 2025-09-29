<script lang="ts">
	import SettingsController from "$lib/controller/settings.svelte";

	// this might need to be derived
	let settings: { name: string; value: boolean; description: string }[] = [
		{ name: "Keybinds", value: SettingsController.keybindTooltips, description: "Show keybinds in the UI" },
		{ name: "Offline Mode", value: SettingsController.offlineMode, description: "Don't attempt to save data in the database" },
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
				<div class="form-check form-switch">
					<input class="form-check-input" type="checkbox" role="switch" id={"flexSwitchCheck" + s.name} checked={s.value} />
					<label class="form-check-label" for={"flexSwitchCheck" + s.name}>{s.description}</label>
				</div>
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
