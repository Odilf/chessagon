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
  export let gameId: string;

  $: expectedDuration = `${Math.round(timeControl.totalTime(40))} minutes`;

  const dispatch = createEventDispatcher<{ cancel: void }>();

  let channel: Channel | null = null;
  onMount(() => {
    channel = getPusher().subscribe(gameChannel(gameId));
    channel.bind(gameStartedEvent, () => {
      invalidateAll();
    });
  });

  onDestroy(() => {
    channel?.unbind_all();
  });
</script>

<h1 class="text-2xl text-balance">Waiting for a player to join...</h1>

<Spinner class="p-4 m-4 h-2 aspect-square" />

<div class="flex flex-col items-center">
  <div class="font-bold text-3xl">{timeControl.toString()}</div>
  <div>~{expectedDuration}</div>
  {#if host.color !== null}
    <div class="text-xl mt-4">
      You are playing as <span class="font-bold">{Color[host.color].toLowerCase()}</span>
    </div>
  {/if}
</div>

<button class="btn btn-xl variant-ghost-warning mt-8" on:click={() => dispatch("cancel")}>
  Cancel
</button>
