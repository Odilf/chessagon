<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { Color } from "$engine/chessagon";
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import { handleSupabaseResponse } from "$lib/db/utils.js";
  import WaitingForPlayer from "./WaitingForPlayer.svelte";

  export let data;

  async function cancelGame() {
    const response = await data.supabase
      .from("live_games")
      .delete()
      .eq("id", data.game.id);

    handleSupabaseResponse(response);

    invalidate(`game:${data.game.id}`);
  }
</script>

{#if data.game.isActive}
  <div class="h-full w-full flex flex-col md:flex-row justify-around">
    <div class="px-2 md:px-0 py-4 max-w-full h-full">
      <BoardManaged playerColor={Color.White} />
    </div>
    <div class="grid place-content-center">
      <span class="font-bold text-3xl">Your turn</span>
      <span class="font-bold text-3xl">03:20</span>
    </div>
  </div>
{:else}
  <WaitingForPlayer {...data.game} on:cancel={cancelGame} />
{/if}

<style lang="postcss">
  :global(main) {
    max-width: none !important; /* TODO: is `!important` really necessary? */
  }

  :global(svg) {
    /* @apply bg-red-500; */
  }
</style>
