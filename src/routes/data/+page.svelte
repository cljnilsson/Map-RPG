<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageServerData } from "./$types";

	let { data }: { data: PageServerData } = $props();
</script>

<div class="wrapper mt-3 mx-5 px-3 py-3">
	<h1>Hi, {data.user.username}!</h1>
	<p>Your user ID is {data.user.id}.</p>
	<form method="post" action="/api/logout" use:enhance>
		<button>Sign out</button>
	</form>
</div>

<style>
	.wrapper {
		background: rgba(235, 235, 235, 0.6);
		border-radius: 10px;
		padding-top: 0.75rem;
		padding-bottom: 0.75rem;
	}
</style>
