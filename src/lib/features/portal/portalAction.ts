import { tick } from "svelte";

// Credit to: https://github.com/romkor/svelte-portal/blob/master/src/Portal.svelte
export function portal(el: HTMLElement, target: string | HTMLElement = "body") {
	let targetEl: Element | null;

	async function update(newTarget: string | HTMLElement) {
		target = newTarget;
		if (typeof target === "string") {
			targetEl = document.querySelector(target);
			if (targetEl === null) {
				await tick();
				targetEl = document.querySelector(target);
			}
			if (targetEl === null) {
				throw new Error(`No element found matching css selector: "${target}"`);
			}
		} else if (target instanceof HTMLElement) {
			targetEl = target;
		} else {
			throw new TypeError(`Unknown portal target type: ${target === null ? "null" : typeof target}. Allowed types: string (CSS selector) or HTMLElement.`);
		}

		targetEl.appendChild(el);
		el.hidden = false;
	}

	function destroy() {
		if (el.parentNode) {
			el.parentNode.removeChild(el);
		}
	}

	void update(target);
	return { update, destroy };
}