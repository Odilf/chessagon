<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let username: string;
  export let rating: number;

  const dispatch = createEventDispatcher<{ logout: null }>();
</script>

<div class="card p-4 variant-glass-primary min-h-[100px]">
  <h1 class="h1">{username}</h1>
  <span> {rating} ELO </span>

  <div class='flex'>
	<div class='flex-1' />
	<button class='btn variant-ghost-error' on:click={() => dispatch('logout')}> Log out </button>
  </div>
</div>

<style>
  .card {
    min-width: min(95vw, 500px);
  }
</style>
