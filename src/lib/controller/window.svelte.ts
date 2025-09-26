import type { WindowTypes } from "$lib/types/window";
import ClassInstanceList from "$lib/utils/ClassInstanceList";

// Cannot use static $state
let _latestWindowOpenedState: WindowController | null = $state(null);
let _openWindows = $state<WindowController[]>([]);

export default class WindowController extends ClassInstanceList {
	// Default values don't matter since they're always assigned in constructur but needed for $state
	private _x: number = $state(0);
	private _y: number = $state(0);
	private _visible: boolean = $state(false);
	private _name: WindowTypes = $state("");
	private savePosition: boolean = true; // Implement later, for example the inventory splitter should not be saved in DB

	constructor(visible: boolean, x: number, y: number, name: WindowTypes) {
		super();
		this._x = x;
		this._y = y;
		this._visible = visible;
		this._name = name;
	}

	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public get x(): number {
		return this._x;
	}

	public get y(): number {
		return this._y;
	}

	public get position(): { x: number; y: number } {
		return { x: this.x, y: this.y };
	}

	public get visible(): boolean {
		return this._visible;
	}

	public get name(): string {
		return this._name;
	}

	public set x(v: number) {
		this._x = v;
	}

	public set y(v: number) {
		this._y = v;
	}

	public set position({ x, y }: { x: number; y: number }) {
		this.x = x;
		this.y = y;
	}

	public set visible(v: boolean) {
		// Ensure the order of the array refers to the order of which they were opened
		if (v === true) {
			WindowController.latestWindowOpened = this;
			_openWindows = [..._openWindows, this];
		} else {
			_openWindows = _openWindows.filter((w) => w !== this);
		}

		this._visible = v;
	}

	public set name(v: WindowTypes) {
		this._name = v;
	}

	public static get latestWindowOpened() {
		return _latestWindowOpenedState;
	}

	public static set latestWindowOpened(v: WindowController | null) {
		_latestWindowOpenedState = v;
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static getByName(name: WindowTypes): WindowController {
		return this.all.filter((w): w is WindowController => w instanceof WindowController && w.name === name)[0];
	}

	public static hideAll() {
		for (const window of WindowController.all) {
			if (window instanceof WindowController) {
				window.visible = false;
			}
		}
	}

	public static isOpen(window: WindowController): boolean {
		return _openWindows.includes(window);
	}

	public static isOpenAt(window: WindowController): number {
		return _openWindows.indexOf(window);
	}

	public static isWindowType(key: string): key is WindowTypes {
		return [
			"Logger",
			"Navigator",
			"UnitManagement",
			"Resources",
			"Events",
			"Quests",
			"Inventory",
			"Vendor",
			"Roll",
			"Container",
			"InventorySplitter"
		].includes(key); // reuse windowtypes here
	}
}

new WindowController(false, 50, 900, "Logger");
new WindowController(true, 1000, 1250, "Navigator");
new WindowController(true, 1300, 1250, "Resources");
new WindowController(true, 600, 950, "UnitManagement");
new WindowController(true, 1600, 1250, "Events");
new WindowController(true, 1300, 450, "Quests");
new WindowController(false, 300, 450, "Inventory");
new WindowController(false, 300, 450, "Vendor");
new WindowController(false, 800, 450, "Roll");
new WindowController(false, 300, 400, "Container");
new WindowController(false, 0, 0, "InventorySplitter");

// Setting to initial visible values
_openWindows = WindowController.all.filter((w): w is WindowController => w instanceof WindowController && w.visible);
