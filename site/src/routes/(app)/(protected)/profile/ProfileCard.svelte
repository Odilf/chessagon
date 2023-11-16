<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let username: string;
  export let rating: number;

  const dispatch = createEventDispatcher<{ logout: null }>();
</script>

<div class="card variant-glass-primary p-4 min-h-[100px]">
  <div class="flex">
    <div class="w-full">
      <h1 class="h1 w-full">{username}</h1>
      <h2 class="h3">Rating: {rating}</h2>
      <div class="flex">
        <div class="flex-1" />
      </div>
    </div>
  </div>

  <button
    class="btn variant-ghost-error mt-4"
    on:click={() => dispatch("logout")}
  >
    Log out
  </button>
</div>

<style>
  .card {
    min-width: min(95vw, 500px);
  }

  h2 {
    font-weight: 100;
  }
</style>
