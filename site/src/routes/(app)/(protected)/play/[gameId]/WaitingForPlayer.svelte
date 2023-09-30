<script lang="ts">
  import type { Color } from "$engine/chessagon";
  import type { TimeControl } from "$lib/timeControls";

  import Spinner from "$lib/utils/Spinner.svelte";
  import { createEventDispatcher } from "svelte";
  export let timeControl: TimeControl;
  export let challenger: { color: Color | null };

  $: expectedDuration = `${
    Math.floor(timeControl.totalTime(40) * 4) / 4
  } minutes`;

  const dispatch = createEventDispatcher<{ cancel: void }>();
</script>

<h1 class="text-2xl text-balance pt-8">Waiting for a player to join...</h1>

<Spinner class="p-4 w-[100px] h-[100px]" />

<div class="self-start">
  Format: {timeControl.toString()} <br />
  Expected duration: {expectedDuration} <br />
</div>

{#if challenger.color}
  <div>
    You are playing as {challenger.color}
  </div>
{/if}

<button class="btn variant-soft-warning" on:click={() => dispatch("cancel")}>
  Cancel
</button>
