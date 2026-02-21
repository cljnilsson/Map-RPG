<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import Loading from "$lib/utils/loading.svelte";

  let email = $state("");
  let password = $state("");
  let name = $state(""); // TODO
  let errorMsg = $state("");
  let loading = $state(false);

  function onEnter(event: KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      attemptLogin();
    }
  }

  async function attemptLogin() {
    const { data, error } = await authClient.signIn.email(
      {
        email: email, // required
        password: password, // required
        rememberMe: true,
      },
      {
        onRequest: (ctx) => {
          loading = true;
        },
        onSuccess: (ctx) => {
          loading = false;
        },
        onError: (ctx) => {
          // display the error message
          errorMsg = ctx.error.message;
          loading = false;
        },
      },
    );
  }

  async function attemptLogout() {
    await authClient.signOut();
    // = null;
  }
  const session = authClient.useSession();
</script>

<div class="container mt-3">
  <div class="row justify-content-center">
    <div class="col-auto">
      <h1 class="text-center">Login</h1>
      {#if loading}
        <Loading />
      {:else if $session.data?.user}
        <p>You're already logged in! {$session.data.user.email}</p>
        <button
          type="button"
          class="btn btn-lg btn-dark"
          onclick={attemptLogout}>Logout</button
        >
      {:else}
        <div class="mb-3">
          <label class="form-label" for="email"> Email </label>
          <input
            class="form-control"
            id="email"
            name="email"
            placeholder="Email"
            bind:value={email}
            onkeydown={onEnter}
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="password"> Password </label>
          <input
            class="form-control"
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            bind:value={password}
            onkeydown={onEnter}
          />
        </div>
        <div class="mt-3 text-center">
          <button type="button" class="btn btn-primary" onclick={attemptLogin}
            >Login</button
          >
          <a href="/register">
            <button type="button" class="btn btn-primary">Register</button>
          </a>
        </div>
        <p style="color: red">{errorMsg ?? ""}</p>
      {/if}
    </div>
  </div>
</div>

<style>
  .container {
    background: rgba(235, 235, 235, 0.6);
    border-radius: 10px;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
</style>
