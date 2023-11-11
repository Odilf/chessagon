<script lang="ts">
  import { TimeControl, timeControls } from "$lib/timeControls";
  import GamePreview from "./GamePreview.svelte";
  import { goto, invalidate } from "$app/navigation";
  import type { Color } from "$engine/chessagon";
  import { getToastStore } from "@skeletonlabs/skeleton";
  import { enhance } from "$app/forms";
  import todo from "ts-todo";

  export let data;

  const toastStore = getToastStore();

  async function createGame(
    timeControl: TimeControl,
    color: Color | null = null,
  ) {
    // const { data, error } = await supabase
    //   .from("live_games")
    //   .insert({
    //     tc_minutes: timeControl.minutes,
    //     tc_increment: timeControl.increment,
    //     challenger_id: session.user.id,
    //     challenger_color: color ?? Math.floor(Math.random() * 2),
    //   })
    //   .select()
    //   .single();

    // if (error) {
    //   toastStore.trigger({
    //     message: formatError(error),
    //     background: "variant-filled-error",
    //   });

    //   return;
    // }

    // if (data === null) {
    //   toastStore.trigger({
    //     message: "Selected game is `null`",
    //     background: "variant-filled-error",
    //   });

    //   return;
    // }

    // goto(`/play/${data.id}`);
  }

  async function joinGame(gameId: string) {
    // const { error } = await supabase
    //   .from("live_games")
    //   .update({ acceptant_id: session.user.id, started_at: new Date().toISOString() })
    //   .eq("id", gameId);

    // if (error) {
    //   toastStore.trigger({
    //     message: formatError(error),
    //     background: "variant-filled-error",
    //   });

    //   return;
    // }

    await invalidate(`game:${gameId}`);
    await goto(`/play/${gameId}`);
  }
</script>

<h1 class="h1 py-4">Select a time control</h1>

<div class="grid grid-cols-4 gap-3">
  {#each timeControls as timeControl}
    <form action="?/createGame" method="post" use:enhance>
      <button class="card btn h3 variant-outline-secondary flex flex-col w-full">
        {timeControl.toString()}
      </button>

      <input type="number" name="increment" value={timeControl.increment} class="hidden">
      <input type="number" name="minutes" value={timeControl.minutes} class="hidden">
    </form>
  {/each}
  
  <button class="card btn h3 variant-outline-secondary flex flex-col" on:click={() => todo()}>
    custom
  </button>
</div>

<h2 class="h2 pt-8 pb-4">...or join an existing game</h2>

<div class="flex flex-wrap gap-4">
  <!-- {#await data.games}
    <span> Loading games... </span>
  {:then response}
    {@const games = handleSupabaseResponse(response)}
    {#each games ?? [] as game}
      <!-- {#each data.games ?? [] as game} --!>
      {@const timeControl = new TimeControl(game.tc_minutes, game.tc_increment)}
      <GamePreview
        {timeControl}
        challenger={{
          username:
            game.profiles?.username ?? "deleted account (TODO: check this)",
          color: game.challenger_color,
        }}
        on:click={() => joinGame(game.id)}
      />
    {/each}
  {/await} -->
</div>
