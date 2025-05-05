<script lang="ts">
	import { enhance } from "$app/forms";
	import type { LayoutData } from "$lib/types/layoutData";

	let { data }: { data: LayoutData } = $props();

	let isLoggedIn: boolean = $derived(!!data?.user);
	let flags: { name: string; value: boolean }[] = $derived(
		data?.userFlags.map((flag: { name: string; value: number }) => ({
			name: flag.name,
			value: flag.value === 1
		})) ?? []
	);

	$effect(() => {
		console.log(data);
		if (isLoggedIn) {
			console.log("Is logged in", flags);
		} else {
			console.log("Is not logged in");
		}
	});
</script>

<nav class="text-center">
	<a href="/">Overview</a>
	<a href="/map">Map</a>
	<a href="/dice">Dice demo</a>
	<a href="/talkingtest">Dialogue demo</a>
	<a href="/creator">Creator demo</a>
	{#if isLoggedIn}
		<form method="POST" action="/api/logout" style="display: inline;" use:enhance>
			<button type="submit" class="btn btn-link p-0 m-0 align-baseline"> Logout </button>
		</form>
	{:else}
		<a href="/login">Login</a>
	{/if}
	<a href="/data">Data Visualizer</a>
</nav>

<style lang="scss">
	nav {
		background: rgba(235, 235, 235, 0.6);
		padding-top: 0.3rem;
		padding-bottom: 0.3rem;
	}

	button,
	a {
		color: black;
		&:hover {
			color: white;
		}
	}

	a {
		padding-left: 1rem;
		padding-right: 1rem;
		&:hover {
			color: white;
		}
	}
</style>
