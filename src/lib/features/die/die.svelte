<script>
	import Blank from './Blank.svelte';
	import Dot from './Dot.svelte';

	export let dots = randomNumber();
	let flip = false;

	function randomNumber() {
		return Math.floor(Math.random() * 6) + 1;
	}

	function roll() {
		if (flip) {
			return;
		}
		flip = true;

		setTimeout(() => {
			dots = randomNumber();
		}, 600);
	}

	function rollComplete() {
		flip = false;
	}

	function onEnter(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			roll();
		}
	}
</script>

<div
	onclick={roll}
	class="face"
	class:animated={flip}
	class:flip
	onanimationend={rollComplete}
	tabindex="0"
	role="button"
	onkeydown={onEnter}
>
	{#if dots == 1}
		<Blank /><Blank /><Blank />
		<Blank /><Dot /><Blank />
		<Blank /><Blank /><Blank />
	{:else if dots == 2}
		<Blank /><Blank /><Dot />
		<Blank /><Blank /><Blank />
		<Dot /><Blank /><Blank />
	{:else if dots == 3}
		<Blank /><Blank /><Dot />
		<Blank /><Dot /><Blank />
		<Dot /><Blank /><Blank />
	{:else if dots == 4}
		<Dot /><Blank /><Dot />
		<Blank /><Blank /><Blank />
		<Dot /><Blank /><Dot />
	{:else if dots == 5}
		<Dot /><Blank /><Dot />
		<Blank /><Dot /><Blank />
		<Dot /><Blank /><Dot />
	{:else if dots == 6}
		<Dot /><Blank /><Dot />
		<Dot /><Blank /><Dot />
		<Dot /><Blank /><Dot />
	{/if}
</div>

<style>
	.face {
		width: 5rem;
		height: 5rem;
		border-style: solid;
		border-width: 1px;
		border-color: black;
		border-radius: 10px;
		display: grid;
		grid-template-columns: auto auto auto;
		justify-items: center;
		align-items: center;
		padding: 10px;
	}
</style>
