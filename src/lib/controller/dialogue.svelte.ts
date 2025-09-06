import type { Message, CharSprite } from "$lib/types/message";
import DialogueStore from "$lib/stores/dialogue.svelte";

type DialogueArgs = {
	msgs: Message[];
	player: CharSprite;
	onEnd?: () => void;
	current?: number;
};

let all: DialogueController[] = $state([]);

export default class DialogueController {
	private _msgs: Message[] = $state([]); // arguably does not need to be state but keeping it this way for now
	private _player: CharSprite;
	private _onEnd?: () => void;
	private _current: number = $state(-1);

	constructor({msgs, player, onEnd = () => this.defaultOnEnd(), current = 0}: DialogueArgs) {
		this._msgs = msgs;
		this._player = player;
		this._onEnd = onEnd;
		this._current = current;
		all = [...all, this];
	}

	destroy() {
		all = all.filter((i) => i !== this);
	}

	// ---------------
	// GETTERS / SETTERS
	// ---------------

	public static get all() {
		return all;
	}

	public static get active(): DialogueController | undefined {
		return all[0];
	}

	public static get inDialogue(): boolean {
		return DialogueStore.inDialogue;
	}

	public static set inDialogue(v: boolean) {
		DialogueStore.inDialogue = v;
	}

	public get msgs() {
		return this._msgs;
	}

	public set msgs(v: Message[]) {
		this._msgs = v;
	}

	public get player() {
		return this._player;
	}

	public get onEnd() {
		return this._onEnd;
	}

	public get current() {
		return this._current;
	}

	public set current(v: number) {
		this._current = v;
	}

	// ---------------
	// FUNCTIONS
	// ---------------

	public next(): DialogueController | undefined {
		if(all.length === 1) {
			return undefined;
		}

		const index = all.findIndex((d) => d === this);
		const next = all[index + 1];

		this.destroy();

		return next as DialogueController;
	}

	public defaultOnEnd() {
		console.log("Dialogue ended, default callback used,");
		this.destroy();
		/*
		if(DialogueController.all.length === 1) {
			this.destroy();
		} else {
			this.next();
		}*/
	}
}
