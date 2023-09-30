<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let username: string;
  export let rating: number;
  export let id: string;

  const dispatch = createEventDispatcher<{ logout: null }>();
</script>

<div class="card p-4 variant-glass-primary min-h-[100px]">
  <h1 class="h1">{username}</h1>
  <h2 class="h3">{rating} ELO</h2>

  <div class="opacity-20">{id}</div>

  <div class="flex">
    <div class="flex-1" />
    <button class="btn variant-ghost-error" on:click={() => dispatch("logout")}>
      Log out
    </button>
  </div>
</div>

<style>
  .card {
    min-width: min(95vw, 500px);
  }
</style>
