<script lang="ts">
	let { data } = $props();

	let isLoggedIn: boolean = $derived(data?.user);

	$effect(() => {
		console.log(data);
		if (isLoggedIn) {
			console.log("Is logged in");
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
		<form method="POST" action="/api/logout" style="display: inline;">
			<button type="submit" style="background: none; border: none; color: blue; text-decoration: underline; cursor: pointer; padding: 0;">
				Logout
			</button>
		</form>
	{:else}
		<a href="/login">Login</a>
	{/if}
	<a href="/data">Data Visualizer</a>
</nav>

<style>
	nav {
		background: rgba(235, 235, 235, 0.6);
		padding-top: 0.3rem;
		padding-bottom: 0.3rem;
	}

	a {
		color: black;
		padding-left: 1rem;
		padding-right: 1rem;
	}
</style>
