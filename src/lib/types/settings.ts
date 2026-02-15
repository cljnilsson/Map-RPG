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

export type ToggleSetting = { name: string; key: ToggleKey; description: string };

export type KeybindSetting = {
	name: string;
	key: KeybindKey;
	description: string;
};

export type SettingChunk<T extends ToggleSetting | KeybindSetting> = {
	title: string;
	settings: T[];
};
