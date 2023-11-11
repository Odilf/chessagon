<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import { Color, GameState, Vector } from "$engine/chessagon";
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  // import { handleSupabaseResponse } from "$lib/db/utils.js";
  import { onDestroy } from "svelte";
  import WaitingForPlayer from "./WaitingForPlayer.svelte";
  import { enhance } from "$app/forms";

  export let data;

  $: console.log(data);
  

  let game = new GameState();

  // if (data.game.isActive) {
  //   for (const { origin, target } of data.game.moves) {
  //     try {
  //       game.try_move(origin, target);
  //     } catch (err) {
  //       console.warn(err);
  //       throw new Error("FATAL ERROR: Invalid move in game history");
  //     }
  //   }
  // }

  async function handleMove({
    detail: { from, to },
  }: {
    detail: { from: Vector; to: Vector };
  }) {
  //   skipNextUpdate = true;

  //   let response = await fetch(`${$page.url}/send-move`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/blob",
  //     },
  //     body: Int8Array.from([from.x, from.y, to.x, to.y]),
  //   });

  //   if (response.ok) {
  //     try {
  //       game.try_move(from, to);
  //     } catch {
  //       throw new Error("TODO: Describe error");
  //     }

  //     game.board = game.board;
  //   } else {
  //     console.log(response)
  //   }
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

  // onDestroy(() => {
  //   channel.unsubscribe();
  // });
</script>

{#if data.game.isActive}
  <div
    class="h-full w-full max-h-full flex flex-col md:flex-row justify-around"
  >
    <div class="board-wrapper px-2 md:px-0 py-4 overflow-hidden flex-shrink">
      <BoardManaged
        on:move={handleMove}
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
    <WaitingForPlayer timeControl={data.game.timeControl} challenger={{ color: Color.Black }} />
  </form>
{/if}

<style lang="postcss">
  .board-wrapper {
    width: min(var(--screen-without-nav), 100%);
    height: min(var(--screen-without-nav), 100vw);
  }
</style>
