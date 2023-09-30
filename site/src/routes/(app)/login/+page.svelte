<script>
  import { enhance } from "$app/forms";
  import { TabGroup, Tab } from "@skeletonlabs/skeleton";
  import { slide } from "svelte/transition";

  export let form;
  export let data;

  let tab = "login";
</script>

<h1 class="h1 mb-10">Login</h1>

<TabGroup>
  <Tab bind:group={tab} name="login" value="login">Log in</Tab>
  <Tab bind:group={tab} name="register" value="register">Register</Tab>
  <!-- Tab Panels --->
  <svelte:fragment slot="panel">
    {#if form?.error}
      <aside class="alert variant-soft-error my-8" transition:slide>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div class="alert-message">
          <h3 class="h3">Error while logging in:</h3>
          <p>{form?.error.message}</p>
        </div>
      </aside>
    {/if}

    <form method="POST" use:enhance class="w-screen max-w-xl px-4">
      <label class="label" for="email"> Email </label>
      <input
        class="input"
        type="text"
        id="email"
        name="email"
        value={form?.email ?? ""}
      />

      {#if tab === "register"}
        <label class="label" for="username"> Username </label>
        <input
          class="input"
          type="text"
          id="username"
          name="username"
          value={form?.username ?? ""}
        />
      {/if}

      <label class="label" for="password"> Password </label>
      <input class="input" type="password" id="password" name="password" />

      <div>
        <button class="btn variant-form-material" formaction="?/login">
          Submit
        </button>
        <!-- <button class="btn variant-form-material" formaction="?/register">
          Register
        </button> -->
      </div>
    </form>
  </svelte:fragment>
</TabGroup>

{#if form?.data}
  <p>Logged in with email {form?.data.user?.email}</p>
{/if}

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>
