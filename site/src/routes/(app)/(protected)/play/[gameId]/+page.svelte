<script lang="ts">
  import { Color, Vector } from "$engine/chessagon";
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import { onDestroy } from "svelte";
  import WaitingForPlayer from "./WaitingForPlayer.svelte";
  import { enhance } from "$app/forms";
  import unwrap from "ts-unwrap";
  import {
    gameChannel,
    newMoveEventName,
    type NewMoveEventData,
  } from "$lib/pusher/events";
  import {
    type Move,
    gameFromMoves,
    calculateTimeRemaining,
  } from "$lib/wasmTypesGlue";
  import { getPusher, pusherStore } from "$lib/pusher/client";
  import { sendMove } from "$lib/db/actions/client";

  export let data;

  let game = gameFromMoves(data.game.moves);
  // let timeRemaining = calculateTimeRemaining(
  //   data.game.moves,
  //   data.playerColor,
  //   data.game.started_at,
  //   data.game.timeControl,
  // );

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

    game.board = game.board; // Trigger reactivity
  };

  const channel = getPusher().subscribe(gameChannel(unwrap(data.game.id)));
  channel.bind(newMoveEventName, (move: NewMoveEventData) => {
    const { origin, target } = move;

    makeMove({
      origin: new Vector(origin.x, origin.y),
      target: new Vector(target.x, target.y),
    });
  });

  onDestroy(() => {
    channel.unbind_all();
  });

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
</script>

{#if data.game.isActive}
  <div
    class="h-full w-full max-h-full flex flex-col md:flex-row justify-around"
  >
    <div class="board-wrapper px-2 md:px-0 py-4 overflow-hidden flex-shrink">
      <BoardManaged
        on:move={({ detail: move }) => handleMove(move)}
        {game}
        playerColor={data.playerColor}
        on:result={({ detail }) => {
          if (detail.winner) {
            console.log(Color[detail.winner]);
          } else {
            console.log("Draw");
          }
        }}
      />
    </div>
    <div class="grid place-content-center">
      <span class="font-bold text-3xl">Your turn</span>
      <span class="font-bold text-3xl">03:20</span>
    </div>
  </div>
{:else}
  <form method="post" action="?/cancelGame" use:enhance class="flex flex-col items-center">
    <WaitingForPlayer
      timeControl={data.game.timeControl}
      host={{ color: data.game.black ? Color.Black : Color.White }}
    />
  </form>
{/if}

<style lang="postcss">
  .board-wrapper {
    width: min(var(--screen-without-nav), 100%);
    height: min(var(--screen-without-nav), 100vw);
  }
</style>
