import LogController from "$lib/controller/logs.svelte";
import { getSettingForUser } from "$lib/api/settings.remote";

class SettingsController {
  private _keybindTooltips: boolean = $state(true);
  private _offlineMode: boolean = $state(false);
  private _darkMode: boolean = $state(false);
  private _showInventory: boolean = $state(true);
  private _showNavigation: boolean = $state(true);
  private _showQuests: boolean = $state(true);
  private _showEvents: boolean = $state(true);
  private _showLogs: boolean = $state(true);
  private _showResources: boolean = $state(true);
  //
  private _inventoryKeybind: string = $state("i");
  private _resourcesKeybind: string = $state("r");
  private _questsKeybind: string = $state("q");
  private _logsKeybind: string = $state("l");
  private _eventsKeybind: string = $state("e");
  private _navigationKeybind: string = $state("n");
  private _backKeybind: string = $state("esc");

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

  get showInventory() {
    return this._showInventory;
  }

  set showInventory(value: boolean) {
    this._showInventory = value;
    LogController.newLog(`showInventory set to ${value}`, "info");
  }

  get showNavigation() {
    return this._showNavigation;
  }

  set showNavigation(value: boolean) {
    this._showNavigation = value;
    LogController.newLog(`dark mode set to ${value}`, "info");
  }

  get showQuests() {
    return this._showQuests;
  }

  set showQuests(value: boolean) {
    this._showQuests = value;
    LogController.newLog(`showQuests set to ${value}`, "info");
  }

  get showEvents() {
    return this._showEvents;
  }

  set showEvents(value: boolean) {
    this._showEvents = value;
    LogController.newLog(`showEvents set to ${value}`, "info");
  }

  get showLogs() {
    return this._showLogs;
  }

  set showLogs(value: boolean) {
    this._showLogs = value;
    LogController.newLog(`showLogs set to ${value}`, "info");
  }

  get showResources() {
    return this._showResources;
  }

  set showResources(value: boolean) {
    this._showResources = value;
    LogController.newLog(`showResources set to ${value}`, "info");
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

  get backKeybind() {
    return this._backKeybind;
  }

  set backKeybind(value: string) {
    this._backKeybind = value;
    LogController.newLog(`back keybind set to ${value}`, "info");
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

  get allKeybinds() {
    return [
      this.inventoryKeybind,
      this.resourcesKeybind,
      this.questsKeybind,
      this.logsKeybind,
      this.eventsKeybind,
      this.navigationKeybind,
      this.backKeybind,
    ];
  }

  async load(userId: string) {
    const resp = await getSettingForUser({ userId });

    if (!resp) {
      LogController.newLog(
        `Failed to load settings for user ${userId}`,
        "error",
      );
      return;
    }

    this.offlineMode = resp.offlineMode;
    this.darkMode = resp.darkMode;
    this.keybindTooltips = resp.keybindTooltips;

    if (resp.keybinds.inventory) {
      this.inventoryKeybind = resp.keybinds.inventory;
    }
    if (resp.keybinds.navigation) {
      this.navigationKeybind = resp.keybinds.navigation;
    }
    if (resp.keybinds.quests) {
      this.questsKeybind = resp.keybinds.quests;
    }
    if (resp.keybinds.events) {
      this.eventsKeybind = resp.keybinds.events;
    }
    if (resp.keybinds.logs) {
      this.logsKeybind = resp.keybinds.logs;
    }
    if (resp.keybinds.resources) {
      this.resourcesKeybind = resp.keybinds.resources;
    }
    if (resp.keybinds.back) {
      this.backKeybind = resp.keybinds.back;
    }
  }
}

const instance = new SettingsController();

export default instance;
