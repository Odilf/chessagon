<script lang="ts">
  import GameOverScreen from "./GameOverScreen.svelte";

  import { getStatusFromCode } from "$lib/game/status";
  import { Color, Vector } from "$engine/chessagon";
  import { onDestroy, onMount } from "svelte";
  import WaitingForPlayer from "./WaitingForPlayer.svelte";
  import { enhance } from "$app/forms";
  import unwrap from "ts-unwrap";
  import {
    gameChannel,
    newMoveEventName,
    type NewMoveEventData,
    gameFinishedEvent,
    gameStartedEvent,
  } from "$lib/pusher/events";
  import type { Channel } from "pusher-js";
  import { invalidateAll } from "$app/navigation";
  import LiveBoard from "./LiveBoard.svelte";
  import type { Move } from "$lib/wasmTypesGlue";
  import { checkForTime, sendMove } from "$lib/db/actions/client";
  import { createGameStore } from "$lib/board/gameStore";
  import { getPusher } from "$lib/pusher/client";

  export let data;

  let gameStore = createGameStore(data.game.moves);
  $: status = getStatusFromCode($gameStore.state.status_code())!;

  async function handleMove(move: Move) {
    const request = sendMove(data.game.id, move);

    gameStore.makeMove(move);

    // TODO: Show some feedback when erroring
    const response = await request;
    if (!response.ok) {
      gameStore.undoLastMove();
      console.warn(response.statusText);
    }
  }

  let channel: Channel | null = null;
  onMount(() => {
    channel = getPusher().subscribe(gameChannel(unwrap(data.game.id)));

    channel.bind(newMoveEventName, (move: NewMoveEventData) => {
      const { origin, target } = move;

      gameStore.makeMove({
        origin: new Vector(origin.x, origin.y),
        target: new Vector(target.x, target.y),
      });
    });

    channel.bind(gameStartedEvent, () => {
      invalidateAll();
    })

    channel.bind(gameFinishedEvent, () => {
      invalidateAll();
    });
  });

  onDestroy(() => {
    channel?.unbind_all();
  });
</script>

{#if data.game.isActive}
  <div class="h-full w-full max-h-full relative">
    <GameOverScreen
      {status}
      gameId={data.game.id}
      overrideHide={$gameStore.moveIndex !== data.game.moves.length}
    />

    <LiveBoard
      game={{
        ...data.game,
        playerColor: data.playerColor,
      }}
      {gameStore}
      on:move={({ detail: move }) => handleMove(move)}
      on:outOfTime={async () => {
        await checkForTime(data.game.id);
        await invalidateAll();
      }}
    />
  </div>
{:else}
  <form
    method="post"
    action="?/cancelGame"
    use:enhance
    class="flex flex-col items-center"
  >
    <WaitingForPlayer
      timeControl={data.game.timeControl}
      host={{ color: data.game.black ? Color.Black : Color.White }}
      gameId={data.game.id}
    />
  </form>
{/if}
