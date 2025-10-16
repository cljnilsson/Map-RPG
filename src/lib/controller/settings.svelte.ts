import { LogController } from "$lib/controller/logs.svelte";
import { getSettingForUser } from "$lib/api/settings.remote";

class QuestController {
	private _keybindTooltips: boolean = $state(true);
	private _offlineMode: boolean = $state(false);
	private _darkMode: boolean = $state(false);
	private _inventoryKeybind: string = $state("i");
	private _resourcesKeybind: string = $state("r");
	private _questsKeybind: string = $state("q");
	private _logsKeybind: string = $state("l");
	private _eventsKeybind: string = $state("e");
	private _navigationKeybind: string = $state("n");

	get keybindTooltips() {
		return this._keybindTooltips;
	}

	set keybindTooltips(value: boolean) {
		this._keybindTooltips = value;
		LogController.newLog(`keybind toolips set to ${value}`, "info");
	}

	get offlineMode() {
		return this._offlineMode;
	}

	set offlineMode(value: boolean) {
		this._offlineMode = value;
		LogController.newLog(`offline mode set to ${value}`, "info");
	}

	get darkMode() {
		return this._darkMode;
	}

	set darkMode(value: boolean) {
		this._darkMode = value;
		LogController.newLog(`dark mode set to ${value}`, "info");
	}

	get inventoryKeybind() {
		return this._inventoryKeybind;
	}

	set inventoryKeybind(value: string) {
		this._inventoryKeybind = value;
		LogController.newLog(`inventory keybind set to ${value}`, "info");
	}

	get resourcesKeybind() {
		return this._resourcesKeybind;
	}

	set resourcesKeybind(value: string) {
		this._resourcesKeybind = value;
		LogController.newLog(`resources keybind set to ${value}`, "info");
	}

	get questsKeybind() {
		return this._questsKeybind;
	}

	set questsKeybind(value: string) {
		this._questsKeybind = value;
		LogController.newLog(`quests keybind set to ${value}`, "info");
	}

	get logsKeybind() {
		return this._logsKeybind;
	}

	set logsKeybind(value: string) {
		this._logsKeybind = value;
		LogController.newLog(`logs keybind set to ${value}`, "info");
	}

	get eventsKeybind() {
		return this._eventsKeybind;
	}

	set eventsKeybind(value: string) {
		this._eventsKeybind = value;
		LogController.newLog(`events keybind set to ${value}`, "info");
	}

	get navigationKeybind() {
		return this._navigationKeybind;
	}
	
	set navigationKeybind(value: string) {
		this._navigationKeybind = value;
		LogController.newLog(`navigation keybind set to ${value}`, "info");
	}

	async load(userId: number) {
		const resp = await getSettingForUser({ userId });

		if(!resp) {
			LogController.newLog(`Failed to load settings for user ${userId}`, "error");
			return;
		}

		this.offlineMode = resp.offlineMode;
		this.darkMode = resp.darkMode;
		this.keybindTooltips = resp.keybindTooltips;
		if(resp.keybinds["inventory"]) {
			this.inventoryKeybind = resp.keybinds["inventory"];
		}
	}
}

const instance = new QuestController();

export default instance;
