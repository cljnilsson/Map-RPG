<script lang="ts">
  import type { LayoutData } from "#lib/types/layoutData.js";
  import { resolve } from "$app/paths";
  import { authClient } from "#lib/auth-client.js";

  let { data }: { data: LayoutData } = $props();
  const session = authClient.useSession();
  let isLoggedIn: boolean = $derived(!!$session.data?.user);
  let flags: { name: string; value: boolean }[] = $derived(
    data?.userFlags.map((flag: { name: string; value: number }) => ({
      name: flag.name,
      value: flag.value === 1,
    })) ?? [],
  );

  $effect(() => {
    if (isLoggedIn) {
      console.log("Is logged in", flags);
    } else {
      console.log("Is not logged in");
    }
    console.log(data);
  });

  async function attemptLogout() {
    await authClient.signOut();
  }

</script>

<nav class="navbar bg-body-tertiary border-bottom px-3 py-2">
	<div class="container-fluid d-flex flex-wrap align-items-center justify-content-center gap-2">
		<ul class="navbar-nav nav-menu flex-row flex-wrap justify-content-center gap-1">
			<li class="nav-item"><a class="nav-link" href={resolve('')}>Overview</a></li>
			<li class="nav-item"><a class="nav-link" href={resolve('dice')}>Dice demo</a></li>
			<li class="nav-item"><a class="nav-link" href={resolve('talkingtest')}>Dialogue demo</a></li>
			<li class="nav-item">
				{#if isLoggedIn}
					<button type="button" class="nav-link nav-link-button" onclick={attemptLogout}>Logout</button>
				{:else}
					<a class="nav-link" href={resolve('login')}>Login</a>
				{/if}
			</li>
			<li class="nav-item"><a class="nav-link" href={resolve('data')}>Data Visualizer</a></li>
		</ul>
	</div>
</nav>

<style lang="scss">
	.nav-menu .nav-link {
		padding: 0.45rem 0.75rem;
		color: var(--bs-body-color);
		font-weight: 500;
		border-radius: var(--bs-border-radius);
		text-decoration: none;

		&:hover,
		&:focus-visible {
			color: var(--bs-emphasis-color);
			background-color: var(--bs-tertiary-bg);
		}

		&:focus-visible {
			outline: 2px solid var(--bs-primary);
			outline-offset: 2px;
		}
	}

	.nav-link-button {
		border: 0;
		background: transparent;
	}

</style>
