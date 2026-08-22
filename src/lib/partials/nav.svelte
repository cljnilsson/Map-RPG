<script lang="ts">
  import type { LayoutData } from "#lib/types/layoutData.js";
  import { resolve } from "$app/paths";
  import { authClient } from "#lib/auth-client.js";
  import { onMount } from "svelte";
	import ThemeController from "#lib/controller/theme.svelte.js";
	import { isThemeName, themeOptions } from "#lib/themes.js";

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

	function changeTheme(event: Event) {
		const target = event.currentTarget;
		if (target instanceof HTMLSelectElement && isThemeName(target.value)) {
			ThemeController.theme = target.value;
		}
	}
</script>

<nav class="navbar bg-body-tertiary border-bottom px-3 py-2">
	<div class="container-fluid justify-content-center gap-3">
		<a href={resolve('')}>Overview</a>
		<a href={resolve('dice')}>Dice demo</a>
		<a href={resolve('talkingtest')}>Dialogue demo</a>
		{#if isLoggedIn}
			<button type="button" class="btn btn-link p-0 align-baseline" onclick={attemptLogout}>Logout</button>
		{:else}
			<a href={resolve('login')}>Login</a>
		{/if}
		<a href={resolve('data')}>Data Visualizer</a>
		<label class="visually-hidden" for="theme-picker">Theme</label>
		<select id="theme-picker" class="form-select form-select-sm w-auto" value={ThemeController.theme} onchange={changeTheme}>
			{#each themeOptions as theme (theme.value)}
				<option value={theme.value}>{theme.label}</option>
			{/each}
		</select>
	</div>
</nav>
