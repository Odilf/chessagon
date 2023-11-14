<script lang="ts">
  import { Color, Vector } from "$engine/chessagon";
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import { onDestroy, onMount } from "svelte";
  import WaitingForPlayer from "./WaitingForPlayer.svelte";
  import { enhance } from "$app/forms";
  import unwrap from "ts-unwrap";
  import {
    gameChannel,
    newMoveEventName,
    type NewMoveEventData,
    gameFinishedEvent,
  } from "$lib/pusher/events";
  import { type Move, gameFromMoves } from "$lib/wasmTypesGlue";
  import { getPusher } from "$lib/pusher/client";
  import { checkForTime, sendMove } from "$lib/db/actions/client";
  import { calculateTimeRemaining, formatTime } from "$lib/timeControls";
  import type { Channel } from "pusher-js";
  import { invalidateAll } from "$app/navigation";
  import { getStatusFromCode } from "$lib/game/status";
  import { fade } from "svelte/transition";

  export let data;

  let game = gameFromMoves(data.game.moves);
  $: status = getStatusFromCode(data.game.status_code)!;

  const getTimeRemaining = () => ({
    player: calculateTimeRemaining(
      data.game.moves,
      data.playerColor,
      data.game.started_at,
      data.game.timeControl
    ),
    opponent: calculateTimeRemaining(
      data.game.moves,
      data.playerColor === Color.White ? Color.Black : Color.White,
      data.game.started_at,
      data.game.timeControl
    ),
  });

  let timeRemaining = getTimeRemaining();

  const timeRemainingInterval = setInterval(async () => {
    timeRemaining = getTimeRemaining();

    if (timeRemaining.player <= 0 || timeRemaining.opponent <= 0) {
      await checkForTime(data.game.id);
      await invalidateAll();
      clearInterval(timeRemainingInterval);
    }
  }, 100);

  const makeMove = ({ origin, target }: Move) => {
    const lastMove = data.game.moves[data.game.moves.length - 1];

    // If we're trying to do the same last move, don't.
    // Happens because of optimistic updates
    if (
      lastMove &&
      lastMove.origin.x === origin.x &&
      lastMove.origin.y === origin.y &&
      lastMove.target.x === target.x &&
      lastMove.target.y === target.y
    ) {
      return;
    }

    data.game.moves.push({
      origin,
      target,
      timestamp: new Date(),
      index: data.game.moves.length,
    });
    game.try_move(origin, target);

    // Trigger reactivity
    game.board = game.board;
    data.game.moves = data.game.moves;
  };

  async function handleMove(move: Move) {
    const request = sendMove(data.game.id, move);

    makeMove(move);

    // TODO: Show some feedback when erroring
    const response = await request;
    if (!response.ok) {
      data.game.moves.pop();
      game = gameFromMoves(data.game.moves);
      console.warn(response.statusText);
    }

    game.board = game.board;
  }

  let channel: Channel | null = null;
  onMount(() => {
    channel = getPusher().subscribe(gameChannel(unwrap(data.game.id)));

    channel.bind(newMoveEventName, (move: NewMoveEventData) => {
      const { origin, target } = move;

      makeMove({
        origin: new Vector(origin.x, origin.y),
        target: new Vector(target.x, target.y),
      });
    });

    channel.bind(gameFinishedEvent, () => {
      clearInterval(timeRemainingInterval);
      invalidateAll();
    });
  });

  onDestroy(() => {
    channel?.unbind_all();
    clearInterval(timeRemainingInterval);
  });
</script>

{#if data.game.isActive}
  <div
    class="h-full w-full max-h-full flex flex-col md:flex-row justify-around relative"
  >
    {#if !status.inProgress}
      {#if status.winner !== null}
      <div class="absolute w-full h-full grid gap-4 place-content-center backdrop-blur-lg backdrop-brightness-50" transition:fade={{ duration: 1000 }}>
        <h1 class="text-8xl font-black">{Color[status.winner]} won </h1>
        <div class="flex gap-8">
          <a href="/play" class='flex-1 text-xl btn variant-filled-tertiary w-fit'> Start new game </a>
          <a href="/game/{data.game.id}" class='flex-1 text-xl btn variant-soft-tertiary w-fit'> See game </a>
        </div>
      </div>
      {/if}
    {/if}
    <div class="board-wrapper px-2 md:px-0 py-4 overflow-hidden flex-shrink">
      <BoardManaged
        on:move={({ detail: move }) => handleMove(move)}
        {game}
        playerColor={data.playerColor}
      />
    </div>
    <div class="grid place-content-center">
      <span class="font-bold text-3xl"
        >{formatTime(timeRemaining.opponent)}</span
      >
      <span class="font-bold text-3xl"
        >{data.game.moves.length % 2 === data.playerColor
          ? "Your"
          : "Opponent's"} turn</span
      >
      <span class="font-bold text-3xl">{formatTime(timeRemaining.player)}</span>
    </div>
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

<style lang="postcss">
  .board-wrapper {
    width: min(var(--screen-without-nav), 100%);
    height: min(var(--screen-without-nav), 100vw);
  }
</style>
