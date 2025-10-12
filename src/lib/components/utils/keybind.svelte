<script lang="ts">
	import SettingsController from "$lib/controller/settings.svelte";
	import { onDestroy } from "svelte";
	import { SvelteSet } from "svelte/reactivity";
	import { browser } from "$app/environment";

	let { keybind = $bindable() }: { keybind: string } = $props();
	let allKeybinds = $derived([SettingsController.inventoryKeybind]); // List of current keybinds
	let listening = $state(false);
	let pressed = new SvelteSet<string>();
	let finalizeTimer: number | null = $state(null);

	const keypressAllowance = 200; //in ms
	const blacklist = new Set(["Ctrl + H", "Ctrl + W", "Ctrl + R", "Alt + F4"]); // Browser reserved

	function normalize(e: KeyboardEvent) {
		if (e.key === " " || e.key === "Spacebar") return "Space";
		if (e.key === "Esc") return "Escape";
		if (e.key.length === 1) return e.key.toUpperCase();
		return e.key;
	}

	function startListening() {
		if (!browser) return;
		if (listening) return;
		listening = true;
		pressed.clear();
		window.addEventListener("keydown", onKeydown);
		window.addEventListener("keyup", onKeyup);
	}

	function stopListening() {
		if (!browser) return;

		listening = false;
		pressed.clear();
		if (finalizeTimer) {
			clearTimeout(finalizeTimer);
			finalizeTimer = null;
		}
		window.removeEventListener("keydown", onKeydown);
		window.removeEventListener("keyup", onKeyup);
	}

	function onKeydown(e: KeyboardEvent) {
		e.preventDefault();
		e.stopPropagation();

		const name = normalize(e);
		pressed.add(name);

		// Cancel with Escape
		if (name === "Escape") {
			stopListening();
			return;
		}

		// If a non-modifier key was pressed, finalize right away
		if (!["Control", "Shift", "Alt", "Meta"].includes(name)) {
			finalize();
			return;
		}

		// Otherwise, start or refresh the grace timer for combos
		if (finalizeTimer) clearTimeout(finalizeTimer);
		finalizeTimer = window.setTimeout(() => finalize(), keypressAllowance);
	}

	function onKeyup(e: KeyboardEvent) {
		pressed.delete(normalize(e));
	}

	function finalize() {
		const parts: string[] = [];

		if (pressed.has("Control")) parts.push("Ctrl");
		if (pressed.has("Shift")) parts.push("Shift");
		if (pressed.has("Alt")) parts.push("Alt");
		if (pressed.has("Meta")) parts.push("Meta");

		// choose one non-modifier (the last pressed is ideal, but here just any)
		console.log(pressed.values());
		const nonMods = [...pressed].filter((k) => !["Control", "Shift", "Alt", "Meta"].includes(k));
		console.log(pressed.values(), nonMods);
		if (nonMods.length) parts.push(nonMods[nonMods.length - 1]);

		const combo = parts.join(" + ") || "None";

		if (blacklist.has(combo)) {
			console.error("This keybind is reserved by the browser.");
			return;
		}

		if (Object.values(allKeybinds).includes(combo)) {
			console.error("This keybind is already in use.");
			return;
		}

		keybind = parts.join(" + ") || "None";
		stopListening();
	}

	onDestroy(stopListening);
</script>

<button class="btn btn-primary keybind-btn" class:listening onclick={startListening}>
	{listening ? "Press keys…" : keybind}
</button>

<style>
	.keybind-btn.listening {
		/*border-color: #0d6efd;*/
		box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
		/*color: #0d6efd;*/
		font-weight: bold;
	}
</style>
