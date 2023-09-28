<script>
  import { enhance } from "$app/forms";

  export let form;
  export let data;
</script>

<main class="main-column">
  <h1>Login</h1>

  <form method="POST" use:enhance>
    <label for="email"> Email </label>
    <input type="text" id="email" name="email" value={form?.email ?? ""} />

    <label for="password"> Password </label>
    <input type="text" id="password" name="password" />

    <div>
      <button formaction="?/login"> Log in </button>
      <button formaction="?/register"> Register </button>
    </div>
  </form>

  {#if form?.error}
    <p class="error">Error: {form?.error.message}</p>
  {/if}

  {#if form?.data}
    <p>Logged in with email {form?.data.user?.email}</p>
  {/if}

  <p> {JSON.stringify(data.session)}</p>
</main>

<style>
  form {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .error {
    color: red;
  }
</style>
