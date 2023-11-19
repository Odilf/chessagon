<script lang="ts">
  import { TimeControl, timeControls } from "$lib/timeControls";
  import GamePreview from "./GamePreview.svelte";
  import { goto, invalidateAll } from "$app/navigation";
  import { Color } from "$engine/chessagon";
  import todo from "ts-todo";
  import { getPusher } from "$lib/pusher/client";
  import { generalGameChannel, gameUpdateEvent } from "$lib/pusher/events";
  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onDestroy, onMount } from "svelte";
  import type { Channel } from "pusher-js";

  export let data;

  async function createGame(timeControl: TimeControl) {
    const response = await fetch("/play/create-game", {
      method: "post",
      body: JSON.stringify({ timeControl }),
    });

    if (response.redirected) {
      goto(response.url);
    }
  }

  let channel: Channel | null = null;
  onMount(() => {
    channel = getPusher().subscribe(generalGameChannel);

    channel.bind(gameUpdateEvent, () => {
      invalidateAll();
    });
  });

  onDestroy(() => {
    channel?.unbind(gameUpdateEvent);
  });
</script>

<h1 class="h1 py-8">Select a time control</h1>

<div class="grid grid-cols-4 gap-3 px-4">
  {#each timeControls as timeControl}
    <button
      class="card btn h3 variant-outline-secondary flex flex-col w-full"
      on:click={() => createGame(timeControl)}
    >
      {timeControl.toString()}
    </button>
  {/each}

  <button
    class="card btn h3 variant-outline-secondary flex flex-col"
    on:click={() => todo()}
    disabled
  >
    custom
  </button>
</div>

<h2 class="h2 pt-8 pb-4">...or join an existing game</h2>

<div class="flex flex-wrap gap-4 px-4">
  {#each data.games ?? [] as game (game.id)}
    <form
      transition:fly={{ y: 50 }}
      animate:flip
      method="post"
      action="?/joinGame"
    >
      <GamePreview
        timeControl={game.timeControl}
        host={game.host}
        on:click={() => todo()}
      />

      <input type="hidden" name="gameId" value={game.id} />
      <input
        type="hidden"
        name="color"
        value={Color[1 - game.host.color].toLowerCase()}
      />
    </form>
  {:else}
    <div class="opacity-50 py-8 text-center text-balance">
      Games will appear here when someone creates one
    </div>
  {/each}
</div>
