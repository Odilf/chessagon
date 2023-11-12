<script lang="ts">
  import { page } from "$app/stores";
  import { Color, GameState, Move, Vector } from "$engine/chessagon";
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import { onDestroy, onMount } from "svelte";
  import WaitingForPlayer from "./WaitingForPlayer.svelte";
  import { enhance } from "$app/forms";
  import Pusher from "pusher-js";
  import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from "$env/static/public";
  import { newMoveEvent } from "$lib/pusher/events";
  import { or } from "drizzle-orm";

  export let data;

  let game = new GameState();
  const pusher = new Pusher(PUBLIC_PUSHER_KEY, {
    cluster: PUBLIC_PUSHER_CLUSTER,
  });

  onDestroy(() => {
    pusher.disconnect();
  });

  const channel = pusher.subscribe(`game-${data.game.id}`);
  channel.bind(newMoveEvent, ({ origin, target }: Move) => {
    console.log("Received move", origin, target);
    
    game.try_move(
      new Vector(origin.x, origin.y), 
      new Vector(target.x, target.y)
    );
    game = game; // Trigger reactivity
  });  

  for (const { origin, target } of data.game.moves) {
    try {
      game.try_move(origin, target);
    } catch (err) {
      console.warn(err);
      throw new Error("FATAL ERROR: Invalid move in game history");
    }
  }

  async function handleMove(from: Vector, to: Vector) {
    //   skipNextUpdate = true;

    let response = await fetch(`${$page.url}/send-move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/blob",
      },
      body: Int8Array.from([from.x, from.y, to.x, to.y]),
    });

    try {
      // TODO: Optimistic updates
      // game.try_move(from, to);
    } catch {
      throw new Error("TODO: This should never happen");
    }

    game.board = game.board;
  }

  // let skipNextUpdate = false;

  // const channel = data.supabase
  //   .channel(`update-moves-${data.game.id}`)
  //   .on(
  //     "postgres_changes",
  //     {
  //       event: "INSERT",
  //       schema: "public",
  //       table: "live_moves",
  //       filter: `game_id=eq.${data.game.id}`,
  //     },
  //     (payload) => {
  //       const { origin_x, origin_y, target_x, target_y } = payload.new;

  //       const origin = new Vector(origin_x, origin_y);
  //       const target = new Vector(target_x, target_y);

  //       if (skipNextUpdate) {
  //         skipNextUpdate = false;
  //         return;
  //       }

  //       game.try_move(origin, target);
  //       game = game;
  //     },
  //   )
  //   .subscribe();
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
