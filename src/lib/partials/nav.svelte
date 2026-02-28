<script lang="ts">
  import { enhance } from "$app/forms";
  import type { LayoutData } from "$lib/types/layoutData";
  import { resolve } from "$app/paths";
  import { authClient } from "$lib/auth-client";

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
    console.log(data);
    if (isLoggedIn) {
      console.log("Is logged in", flags);
    } else {
      console.log("Is not logged in");
    }
  });

  async function attemptLogout() {
    await authClient.signOut();
  }
</script>

<nav class="text-center">
  <a href={resolve("/")}>Overview</a>
  <a href={resolve("/dice")}>Dice demo</a>
  <a href={resolve("/talkingtest")}>Dialogue demo</a>
  <a href={resolve("/creator")}>Creator demo</a>
  {#if isLoggedIn}
    <button
      type="button"
      class="btn btn-link p-0 m-0 align-baseline"
      onclick={attemptLogout}
    >
      Logout
    </button>
  {:else}
    <a href={resolve("/login")}>Login</a>
  {/if}
  <a href={resolve("/data")}>Data Visualizer</a>
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
