<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Board from "$lib/board/Board.svelte";
  import { formatStatus, getStatusFromCode } from "$lib/game/status";
  import { gameFromMoves } from "$lib/wasmTypesGlue";
  import unwrap from "ts-unwrap";
  import ProfileCard from "./ProfileCard.svelte";

  export let data;

  $: ({ user } = data.session);
</script>

<main class="main-column py-4">
  <ProfileCard
    username={user?.name ?? "Uknown user"}
    rating={user?.rating}
    on:logout={async () => {
      await fetch("login?/logout", {
        method: "post",
        body: "",
      });
      await invalidateAll();
    }}
  />

  <h2 class="h2 text-3xl mt-8 mb-4">Past games</h2>
</main>

<ul class="flex flex-wrap gap-8 justify-center max-w-4xl">
  {#each data.games as game}
    {@const date = game.created_at.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}
    {@const statusMessage = formatStatus(
      unwrap(getStatusFromCode(game.status_code)),
    )}
    <li
      class="card py-4 variant-soft-secondary even:variant-soft-tertiary flex w-fit"
    >
      <a href="/game/{game.id}" class="btn w-full">
        <div class="h-64 aspect-square">
          <Board
            board={gameFromMoves(game.moves).board}
            playerColor={game.playerColor}
          />
        </div>
        <div class="text-center w-full flex flex-col h-full">
          <div class="flex-1" />
          <div class="text-2xl font-bold">{statusMessage.title}</div>
          <div class="text-3xl">{game.timeControl}</div>
          <div class="flex-1" />
          <div>{game.moves.length} moves</div>
          <div>Played on {date}</div>
          <div class="flex-1" />
        </div>
      </a>
    </li>
  {/each}
</ul>
