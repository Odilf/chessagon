<script lang="ts">
  import { page } from "$app/stores";
  import { Color, Vector } from "$engine/chessagon";
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import { onDestroy } from "svelte";
  import WaitingForPlayer from "./WaitingForPlayer.svelte";
  import { enhance } from "$app/forms";
  import Pusher from "pusher-js";
  import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from "$env/static/public";
  import { newMoveEvent } from "$lib/pusher/events";
  import type { Move } from "$lib/wasmTypesGlue";
  import { gameFromMoves } from "./utils";

  export let data;

  let game = gameFromMoves(data.game.moves);

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

    data.game.moves.push({ origin, target });
    game.try_move(origin, target);

    game.board = game.board; // Trigger reactivity
  };

  const pusher = new Pusher(PUBLIC_PUSHER_KEY, {
    cluster: PUBLIC_PUSHER_CLUSTER,
  });

  onDestroy(() => {
    pusher.disconnect();
  });

  const channel = pusher.subscribe(`game-${data.game.id}`);
  channel.bind(
    newMoveEvent,
    (move: {
      origin: { x: number; y: number };
      target: { x: number; y: number };
    }) => {
      const { origin, target } = move;

      makeMove({
        origin: new Vector(origin.x, origin.y),
        target: new Vector(target.x, target.y),
      });
    }
  );

  async function handleMove(origin: Vector, target: Vector) {
    const request = fetch(`${$page.url}/send-move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/blob",
      },
      body: Int8Array.from([origin.x, origin.y, target.x, target.y]),
    });

    makeMove({ origin, target })

    // TODO: Test if this works. Seems like it should
    const response = await request;
    if (!response.ok) {
      data.game.moves.pop();
      gameFromMoves(data.game.moves);
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
        on:move={({ detail: { from, to } }) => handleMove(from, to)}
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
  <form method="post" action="?/cancelGame" use:enhance>
    <WaitingForPlayer
      timeControl={data.game.timeControl}
      challenger={{ color: Color.Black }}
    />
  </form>
{/if}

<style lang="postcss">
  .board-wrapper {
    width: min(var(--screen-without-nav), 100%);
    height: min(var(--screen-without-nav), 100vw);
  }
</style>
