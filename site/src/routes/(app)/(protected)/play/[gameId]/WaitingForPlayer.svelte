<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { Color } from "$engine/chessagon";
  import { getPusher } from "$lib/pusher/client";
  import { gameChannel, gameStartedEvent } from "$lib/pusher/events";
  import type { TimeControl } from "$lib/timeControls";

  import Spinner from "$lib/utils/Spinner.svelte";
  import type { Channel } from "pusher-js";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  export let timeControl: TimeControl;
  export let host: { color: Color | null };
  export let gameId: string

  $: expectedDuration = `${
    Math.round(timeControl.totalTime(40) * 4) / 4
  } minutes`;

  const dispatch = createEventDispatcher<{ cancel: void }>();

  let channel: Channel | null = null;
  onMount(() => {
    channel = getPusher().subscribe(gameChannel(gameId));
    channel.bind(gameStartedEvent, () => {
      invalidateAll();
    })
  })

  onDestroy(() => {
    channel?.unbind_all();
  })
</script>

<h1 class="text-2xl text-balance pt-8">Waiting for a player to join...</h1>

<Spinner class="p-4 w-[100px] h-[100px]" />

<div class="self-start">
  Format: {timeControl.toString()} <br />
  Expected duration: {expectedDuration} <br />
</div>

{#if host.color !== null}
  <div>
    You are playing as {Color[host.color].toLowerCase()}
  </div>
{/if}

<button class="btn variant-soft-warning" on:click={() => dispatch("cancel")}>
  Cancel
</button>
