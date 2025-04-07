<script lang="ts">
	let { dots = randomNumber() }: { dots?: number } = $props();
	let flip: boolean = $state(false);

	function randomNumber(dieSize: number = 6): number {
		return Math.floor(Math.random() * dieSize) + 1;
	}

	export async function roll() {
		if (flip) {
			return;
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
	}

	function onEnter(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			roll();
		}
	}
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
	<span>{dots}</span>
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
</style>
