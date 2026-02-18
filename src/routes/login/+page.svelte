<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import Loading from "$lib/utils/loading.svelte";

  let email = $state("");
  let password = $state("");
  let name = $state(""); // TODO
  let error = $state("");
  let loading = $state(false);

  async function attemptRegister() {
    const { data } = await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
      },
      {
        onRequest: (ctx) => {
          loading = true;
        },
        onSuccess: (ctx) => {
          loading = true;
        },
        onError: (ctx) => {
          // display the error message
          error = ctx.error.message;
          loading = false;
        },
      },
    );
    console.log(data);
  }

  async function attemptLogin() {
    // TODO
  }
</script>

<div class="container mt-3">
  <div class="row justify-content-center">
    <div class="col-auto">
      <h1>Login/Register</h1>
      {#if loading}
        <Loading />
      {:else}
        <div class="mb-3">
          <label class="form-label" for="username"> Username </label>
          <input
            class="form-control text-center"
            id="username"
            name="username"
            bind:value={email}
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="password"> Password </label>
          <input
            class="form-control text-center"
            id="password"
            type="password"
            name="password"
            bind:value={password}
          />
        </div>
        <div class="mt-3 text-center">
          <button type="button" class="btn btn-primary" onclick={attemptLogin}
            >Login</button
          >
          <button
            type="button"
            class="btn btn-primary"
            onclick={attemptRegister}>Register</button
          >
        </div>
        <p style="color: red">{error ?? ""}</p>
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
