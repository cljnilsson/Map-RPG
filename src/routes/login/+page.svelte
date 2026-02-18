<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import Loading from "$lib/utils/loading.svelte";
  import { onMount } from "svelte";

  let email = $state("");
  let password = $state("");
  let name = $state(""); // TODO
  let errorMsg = $state("");
  let loading = $state(false);

  async function attemptRegister() {
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
  }

  let loginSession: {
    user: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      email: string;
      emailVerified: boolean;
      name: string;
      image?: string | null | undefined;
    };
    session: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    };
  } | null = $state(null);
  onMount(async () => {
    const { data: session, error } = await authClient.getSession();
    if (!error) {
      loginSession = session;
      console.log(session);
    }
  });
</script>

<div class="container mt-3">
  <div class="row justify-content-center">
    <div class="col-auto">
      <h1>Login/Register</h1>
      {#if loading}
        <Loading />
      {:else if loginSession?.user}
        <p>You're already logged in! {loginSession.user.email}</p>
        <button
          type="button"
          class="btn btn-lg btn-dark"
          onclick={attemptLogout}>Logout</button
        >
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
