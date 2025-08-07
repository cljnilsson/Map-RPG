<script lang="ts">
	import { onMount } from "svelte";

	let { dots, sides }: { dots?: number; sides: number } = $props();
	let flip: boolean = $state(false);
	let grow: boolean = $state(false);

	function randomNumber(): number {
		console.log(sides);
		return Math.floor(Math.random() * sides) + 1;
	}

	export async function roll(): Promise<number> {
		if (flip) {
			return -1;
		}

		flip = true;

		return new Promise((resolve) => {
			setTimeout(() => {
				dots = randomNumber();
				resolve(dots);
			}, 600);
		});
	}

	function rollComplete() {
		flip = false;
		grow = true;

		// Reset after animation completes (e.g., 0.5s grow + 0.5s shrink = 1s total)
		setTimeout(() => {
			grow = false;
		}, 500);
	}

	function onEnter(event: KeyboardEvent) {
		if (event.key === "Enter" || event.key === " ") {
			roll();
		}
	}

	onMount(() => {
		dots = randomNumber();
	});
</script>

<div
	onclick={roll}
	class="face"
	class:animate__animated={flip}
	class:animate__flip={flip}
	onanimationend={rollComplete}
	tabindex="0"
	role="button"
	onkeydown={onEnter}
>
	<span class:grow-shrink={grow}>{dots}</span>
</div>

<style>
	.face {
		width: 5rem;
		height: 5rem;
		border: 1px solid black;
		border-radius: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 10px;
		box-sizing: border-box;
		span {
			text-align: center;
			font-size: 2rem;
		}
	}

	@keyframes growAndShrink {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(2);
		}
		100% {
			transform: scale(1);
		}
	}

	.grow-shrink {
		animation: growAndShrink 0.5s ease-in-out;
	}
</style>
