<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import Loading from "$lib/utils/loading.svelte";

  let email = $state("");
  let password = $state("");
  let passwordConfirm = $state("");
  let name = $state("");
  let errorMsg = $state("");
  let loading = $state(false);

  // Not a full and proper validation, better-auth handles that but it's good to change some of the super obvious cases.
  function validate(): boolean {
    if (password.length === 0) {
      errorMsg = "Password is too short";
      return false;
    }

    if (password.length < 5) {
      errorMsg = "Email is too short";
      return false;
    }

    if (password === passwordConfirm) {
      errorMsg = "Passwords don't match";
      return false;
    }

    if (name.length >= 2) {
      errorMsg = "Username is too short";
      return false;
    }

    return true;
  }

  async function attemptRegister() {
    if (!validate) {
      return;
    }

    const { data, error } = await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        //callbackURL: "/", // A URL to redirect to after the user verifies their email (optional)
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
    console.log(data);
  }

  const session = authClient.useSession();
</script>

<div class="container mt-3">
  <div class="row justify-content-center">
    <div class="col-auto">
      <h1 class="text-center">Register Account</h1>
      {#if loading}
        <Loading />
      {:else if $session.data?.user}
        <p>You're already logged in! {$session.data.user.email}</p>
      {:else}
        <div class="mb-3">
          <label class="form-label" for="email"> Email </label>
          <input
            type="email"
            class="form-control"
            id="email"
            name="email"
            placeholder="Email"
            bind:value={email}
          />
        </div>
        <div class="mb-3">
          <label class="form-label" for="username"> Username </label>
          <input
            type="text"
            class="form-control"
            id="username"
            name="username"
            placeholder="Username"
            bind:value={name}
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
          />
        </div>
        <div class="mb-3">
          <input
            class="form-control"
            type="password"
            placeholder="Confirm password"
            bind:value={passwordConfirm}
          />
        </div>
        <div class="mt-3 text-center">
          <button
            type="button"
            class="btn btn-primary"
            disabled={email.length === 0 ||
              name.length === 0 ||
              password.length === 0 ||
              passwordConfirm.length === 0}
            onclick={attemptRegister}>Register</button
          >
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
