<script lang="ts">
import SettingsController from "$lib/controller/settings.svelte";
import KeyBinder from "$lib/components/utils/keybind.svelte";

let currentlyListening: string | undefined = $state(undefined);
let searchText: string = $state("");

type ToggleKey =
	| "keybindTooltips"
	| "offlineMode"
	| "darkMode"
	| "showInventory"
	| "showNavigation"
	| "showQuests"
	| "showEvents"
	| "showLogs"
	| "showResources";

type KeybindKey =
	| "inventoryKeybind"
	| "navigationKeybind"
	| "questsKeybind"
	| "eventsKeybind"
	| "logsKeybind"
	| "resourcesKeybind"
	| "backKeybind";

type ToggleSetting = { name: string; key: ToggleKey; description: string };

type KeybindSetting = {
	name: string;
	key: KeybindKey;
	description: string;
};

type SettingChunk<T extends ToggleSetting | KeybindSetting> = {
	title: string;
	settings: T[];
};

const uiToggles: ToggleSetting[] = [
	{
		name: "Show Inventory Icon",
		key: "showInventory",
		description: "Hides the inventory icon from the UI.",
	},
	{
		name: "Show Navigation Icon",
		key: "showNavigation",
		description: "Hides the navigation icon from the UI.",
	},
	{
		name: "Show Quests Icon",
		key: "showQuests",
		description: "Hides the quest icon from the UI.",
	},
	{
		name: "Show Events Icon",
		key: "showEvents",
		description: "Hides the event icon from the UI.",
	},
	{
		name: "Show Logs Icon",
		key: "showLogs",
		description: "Hides the logs icon from the UI.",
	},
	{
		name: "Show Resources Icon",
		key: "showResources",
		description: "Hides the resources icon from the UI.",
	},
];

const miscToggles: ToggleSetting[] = [
	{
		name: "Keybinds",
		key: "keybindTooltips",
		description: "Show keybinds in the UI",
	},
	{
		name: "Offline Mode",
		key: "offlineMode",
		description: "Don't attempt to save data in the database",
	},
	{ name: "Dark Mode", key: "darkMode", description: "Enable dark mode" },
];

const allKeybindSettings: KeybindSetting[] = [
	{
		name: "Inventory Keybind",
		key: "inventoryKeybind",
		description: "Keybind to open the inventory window",
	},
	{
		name: "Navigation Keybind",
		key: "navigationKeybind",
		description: "Keybind to open the navigation window",
	},
	{
		name: "Quest Keybind",
		key: "questsKeybind",
		description: "Keybind to open the quest window",
	},
	{
		name: "Events Keybind",
		key: "eventsKeybind",
		description: "Keybind to open the events window",
	},
	{
		name: "Logs Keybind",
		key: "logsKeybind",
		description: "Keybind to open the logs window",
	},
	{
		name: "Resources Keybind",
		key: "resourcesKeybind",
		description: "Keybind to open the resources window",
	},
	{
		name: "Back Keybind",
		key: "backKeybind",
		description: "Keybind to to back",
	},
];

const miscChunk: SettingChunk<ToggleSetting> = {
	title: "Misc",
	settings: miscToggles,
};

const uiChunk: SettingChunk<ToggleSetting> = {
	title: "Ui Toggles",
	settings: uiToggles,
};

const keybindChunk: SettingChunk<KeybindSetting> = {
	title: "Keybinds",
	settings: allKeybindSettings,
};

const allSettings: SettingChunk<ToggleSetting | KeybindSetting>[] = [miscChunk, uiChunk, keybindChunk];

function isToggleSetting(s: ToggleSetting | KeybindSetting): s is ToggleSetting {
	return (
		s.key === "keybindTooltips" ||
		s.key === "offlineMode" ||
		s.key === "darkMode" ||
		s.key === "showInventory" ||
		s.key === "showNavigation" ||
		s.key === "showQuests" ||
		s.key === "showEvents" ||
		s.key === "showLogs" ||
		s.key === "showResources"
	);
}

function doesNameMatchSearch(settings: Array<ToggleSetting | KeybindSetting>): Array<ToggleSetting | KeybindSetting> {
	const query = searchText.toLowerCase();

	return settings.filter((setting) => setting.name.toLowerCase().includes(query));
}
</script>

<div class="map-wrapper mt-3 container">
	<h4>Settings</h4>
	<div class="row">
		<div class="col-xl-3 col-md-6 col-12 my-3">
		    <input type="text" max={20} class="form-control mb-2" placeholder="Search.." bind:value={searchText} />
		</div>
	</div>

	{#each allSettings as c (c.title)}
		<div class="settings-chunk">
			<div class="row">
				<div class="col">
					<h5>{c.title}</h5>
				</div>
			</div>

			{#each doesNameMatchSearch(c.settings) as s (s.name)}
				<div class="row">
					<div class="col"><span>{s.name}</span></div>
					<div class="col">
						{#if isToggleSetting(s)}
							<div class="form-check form-switch">
								<input
									class="form-check-input"
									type="checkbox"
									role="switch"
									id={"flexSwitchCheck" + s.name}
									bind:checked={SettingsController[s.key]}
								/>
								<label
									class="form-check-label"
									for={"flexSwitchCheck" + s.name}
								>
									{s.description}
								</label>
							</div>
						{:else}
							<KeyBinder
								bind:keybind={SettingsController[s.key]}
								key={s.name}
								bind:currentlyListening
							/>
						{/if}
					</div>
				</div>
			{/each}
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

	.settings-chunk + .settings-chunk {
		margin-top: 1.5rem;
	}
</style>
