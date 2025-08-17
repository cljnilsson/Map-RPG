import type { WindowData } from "$lib/stores/windows.svelte";
import type { ContainerGameObject } from "$lib/types/gameObject";
import WindowStore from "$lib/stores/windows.svelte";

type WindowTypes = "Logger" | "Navigator" | "UnitManagement" | "Resources" | "Events" | "Quests" | "Inventory" | "Vendor" | "Roll" | "";

//because state does not work inside classes
let openWindows = $state<WindowTypes[]>([]);
let latestWindowOpenedState = $derived(openWindows.length > 0 ? openWindows[openWindows.length - 1] : "");

/*
	Mixed feelings on this approach.
	latestWindowOpenedState was previously inside the setters which I felt was more tradional.
	However this did not work if the visibility was manipulated directly. Eg:
	WindowStore.logger.visible = true;
	I could work around this with: WindowController.logger = {...WindowController.logger, visible: true};
	HOWEVER, if visibility is :binded to a component then it would not work.
	Thus this approach which at least works and seems.. robust? event if I don't really like the style.
*/
$effect.root(() => {
	const windows: [WindowTypes, () => WindowData][] = [
		["Logger", () => WindowStore.logger],
		["Navigator", () => WindowStore.navigation],
		["UnitManagement", () => WindowStore.unit],
		["Resources", () => WindowStore.resources],
		["Events", () => WindowStore.events],
		["Quests", () => WindowStore.quest],
		["Inventory", () => WindowStore.inventory],
		["Vendor", () => WindowStore.vendor],
		["Roll", () => WindowStore.roll],
	];

	for (const [name, getWindow] of windows) {
		$effect(() => {
			const win = getWindow();
			if (win.visible && !openWindows.includes(name)) {
				openWindows = [...openWindows, name];
			} else if (!win.visible && openWindows.includes(name)) {
				openWindows = openWindows.filter(w => w !== name);
			}
		});
	}

	$effect(() => {
		console.log(latestWindowOpenedState);
	});
});

export default class WindowController {
	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public static get latestWindowOpened() {
		return latestWindowOpenedState;
	}

	public static set latestWindowOpened(v: WindowTypes) {
		latestWindowOpenedState = v;
	}

	public static get logger(): WindowData {
		return WindowStore.logger;
	}
	public static set logger(value: WindowData) {
		WindowStore.logger = value;
	}
	public static get navigation(): WindowData {
		return WindowStore.navigation;
	}
	public static set navigation(value: WindowData) {
		WindowStore.navigation = value;
	}
	public static get unit(): WindowData {
		return WindowStore.unit;
	}
	public static set unit(value: WindowData) {
		WindowStore.unit = value;
	}
	public static get resources(): WindowData {
		return WindowStore.resources;
	}
	public static set resources(value: WindowData) {
		WindowStore.resources = value;
	}
	public static get events(): WindowData {
		return WindowStore.events;
	}
	public static set events(value: WindowData) {
		WindowStore.events = value;
	}
	public static get quest(): WindowData {
		return WindowStore.quest;
	}
	public static set quest(value: WindowData) {
		WindowStore.quest = value;
	}
	public static get inventory(): WindowData {
		return WindowStore.inventory;
	}
	public static set inventory(value: WindowData) {
		WindowStore.inventory = value;
	}
	public static get vendor(): WindowData {
		return WindowStore.vendor;
	}
	public static set vendor(value: WindowData) {
		WindowStore.vendor = value;
	}
	public static get roll(): WindowData {
		return WindowStore.roll;
	}
	public static set roll(value: WindowData) {
		WindowStore.roll = value;
	}

	public static get container(): (WindowData & {
		object: ContainerGameObject | null;
	}) {
		return WindowStore.container;
	}
	public static set container(value: WindowData & {
		object: ContainerGameObject | null;
	}) {
		WindowStore.container = value;
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
