import type { WindowTypes } from "$lib/types/window";

let openWindows = $state<WindowController[]>([]);
let latestWindowOpenedState: WindowController | null = $derived(openWindows.length > 0 ? openWindows[openWindows.length - 1] : null);

/*
	Mixed feelings on this approach.
	latestWindowOpenedState was previously inside the setters which I felt was more tradional.
	However this did not work if the visibility was manipulated directly. Eg:
	WindowController.logger.visible = true;
	I could work around this with: WindowController.logger = {...WindowController.logger, visible: true};
	HOWEVER, if visibility is :binded to a component then it would not work.
	Thus this approach which at least works and seems.. robust? event if I don't really like the style.
*/
$effect.root(() => {
	const windows: WindowTypes[] = [
		"Logger",
		"Navigator",
		"UnitManagement",
		"Resources",
		"Events", 
		"Quests",
		"Inventory",
		"Vendor",
	]

	for (const name of windows) {
		$effect(() => {
			const win = WindowController.getByName(name);
			if (win.visible && !openWindows.includes(win)) {
				console.log(`WindowController: ${name} opened`);
				openWindows = [...openWindows, win];
				latestWindowOpenedState = win;
			} else if (!win.visible && openWindows.includes(win)) {
				console.log(`WindowController: ${name} closed`);
				openWindows = openWindows.filter((w) => w.name !== name);
			}
		});
	}

	$effect(() => {
		//console.log(latestWindowOpenedState);
	});
});

// Maybe reuse later
class LinkedList {
	public static all: LinkedList[] = []; // static $state is not supported, going to see if this matters.

	constructor() {
		LinkedList.all = [...LinkedList.all, this];
	}

	public destroy() {
		LinkedList.all = LinkedList.all.filter((i) => i !== this);
	}
}

export default class WindowController extends LinkedList {
	// Default values don't matter since they're always assigned in constructur but needed for $state
	private _x: number = $state(0);
	private _y: number = $state(0);;
	private _visible: boolean = $state(false);
	private _name: WindowTypes = $state("");

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
		this._visible = v;
	}

	public set name(v: WindowTypes) {
		this._name = v;
	}

	public static get openWindows(): WindowController[] {
		return [];
	}

	public static get latestWindowOpened() {
		return latestWindowOpenedState;
	}

	public static set latestWindowOpened(v: WindowController | null) {
		latestWindowOpenedState = v;
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public static getByName(name: WindowTypes): WindowController {
		return this.all.filter((w): w is WindowController => w instanceof WindowController && w.name === name)[0];
	}

	public static hideAll() {
		/*for(const window of WindowController.allTyped) {
			window.visible = false;
		}*/
	}

	public static isOpen(window: WindowController): boolean {
		return openWindows.includes(window);
	}

	public static isOpenAt(window: WindowController): number {
		return openWindows.indexOf(window);
	}

	public static isWindowType(key: string): key is WindowTypes {
		return ["Logger", "Navigator", "UnitManagement", "Resources", "Events", "Quests", "Inventory", "Vendor", "Roll", "Container"].includes(key); // reuse windowtypes here
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