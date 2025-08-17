import type { WindowData } from "$lib/stores/windows.svelte";
import WindowStore from "$lib/stores/windows.svelte";

let latestWindowOpenedState = $state<
  "" | "Logger" | "Navigator" | "UnitManagement" | "Resources" | "Events" | "Quests" | "Inventory" | "Vendor" | "Roll"
>("");

export default class WindowController {
	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public static get latestWindowOpened() {
		return latestWindowOpenedState;
	}

	public static set latestWindowOpened(v: "" | "Logger" | "Navigator" | "UnitManagement" | "Resources" | "Events" | "Quests" | "Inventory" | "Vendor" | "Roll") {
		latestWindowOpenedState = v;
	}

	public static get logger(): WindowData {
		return WindowStore.logger;
	}
	public static set logger(value: WindowData) {
		WindowStore.logger = value;
		if(value.visible) {
			this.latestWindowOpened = "Logger";
		}
	}
	public static get navigation(): WindowData {
		return WindowStore.navigation;
	}
	public static set navigation(value: WindowData) {
		WindowStore.navigation = value;
		if(value.visible) {
			this.latestWindowOpened = "Navigator";
		}
	}
	public static get unit(): WindowData {
		return WindowStore.unit;
	}
	public static set unit(value: WindowData) {
		WindowStore.unit = value;
		if(value.visible) {
			this.latestWindowOpened = "UnitManagement";
		}
	}
	public static get resources(): WindowData {
		return WindowStore.resources;
	}
	public static set resources(value: WindowData) {
		WindowStore.resources = value;
		if(value.visible) {
			this.latestWindowOpened = "Resources";
		}
	}
	public static get events(): WindowData {
		return WindowStore.events;
	}
	public static set events(value: WindowData) {
		WindowStore.events = value;
		if(value.visible) {
			this.latestWindowOpened = "Events";
		}
	}
	public static get quest(): WindowData {
		return WindowStore.quest;
	}
	public static set quest(value: WindowData) {
		WindowStore.quest = value;
		if(value.visible) {
			this.latestWindowOpened = "Quests";
		}
	}
	public static get inventory(): WindowData {
		return WindowStore.inventory;
	}
	public static set inventory(value: WindowData) {
		WindowStore.inventory = value;
		if(value.visible) {
			this.latestWindowOpened = "Inventory";
		}
	}
	public static get vendor(): WindowData {
		return WindowStore.vendor;
	}
	public static set vendor(value: WindowData) {
		WindowStore.vendor = value;
		if(value.visible) {
			this.latestWindowOpened = "Vendor";
		}
	}
	public static get roll(): WindowData {
		return WindowStore.roll;
	}
	public static set roll(value: WindowData) {
		WindowStore.roll = value;
		if(value.visible) {
			this.latestWindowOpened = "Roll";
		}
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static hideAll() {
		this.roll.visible = false;
		this.vendor.visible = false;
		this.inventory.visible = false;
		this.quest.visible = false;
		this.events.visible = false;
		this.resources.visible = false;
		this.unit.visible = false;
		this.navigation.visible = false;
		this.logger.visible = false;
	}
}
