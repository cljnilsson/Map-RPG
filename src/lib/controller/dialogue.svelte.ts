import type { Message, CharSprite } from "$lib/types/message";
import type { Snippet } from "svelte";
import ClassInstanceList from "$lib/utils/ClassInstanceList";
import DialogueStore from "$lib/stores/dialogue.svelte";

type DialogueArgs = {
	msgs: Message[];
	player: CharSprite;
	onEnd?: () => void;
	leftCol?: Snippet;
	current?: number;
};

export default class DialogueController extends ClassInstanceList {
	private _msgs: Message[] = $state([]); // arguably does not need to be state but keeping it this way for now
	private _player: CharSprite;
	private _onEnd?: () => void;
	private _leftCol?: Snippet;
	private _current: number = $state(-1);

	constructor({msgs, player, onEnd = () => this.defaultOnEnd, leftCol, current = 0}: DialogueArgs) {
		super();
		this._msgs = msgs;
		this._player = player;
		this._onEnd = onEnd;
		this._leftCol = leftCol;
		this._current = current;
	}

	// ---------------
	// GETTERS / SETTERS
	// ---------------

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

	public get leftCol() {
		return this._leftCol;
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
		if(DialogueController.all.length === 1) {
			return undefined;
		}

		const index = DialogueController.all.findIndex((d) => d === this);
		const next = DialogueController.all[index + 1];

		this.destroy();

		return next as DialogueController;
	}

	public defaultOnEnd() {
		console.log("Dialogue ended, default callback used,");
		if(DialogueController.all.length === 1) {
			this.destroy();
		} else {
			this.next();
		}
	}
}
