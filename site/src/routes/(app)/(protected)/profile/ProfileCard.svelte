<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let username: string;
  export let rating: number;
  export let img: string | null;

  const dispatch = createEventDispatcher<{ logout: null }>();
</script>

<div class="card variant-glass-primary p-4 min-h-[100px]">
  <div class="flex">
    <div class="w-full">
      <h1 class="h1 w-full">{username}</h1>
      <h2 class="h3">{rating} ELO</h2>
      <div class="flex">
        <div class="flex-1" />
      </div>
    </div>

    <!-- TODO: Handle null image -->
    {#if img}
      <img src={img} alt="Profile" class="w-32 h-32 rounded-lg" />
    {/if}
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
</style>
