<script lang="ts">
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import type { GameStore } from "$lib/board/gameStore";
  import type { TimeControl } from "$lib/timeControls";
  import type { Color } from "$engine/chessagon";
  import type { Move, MoveTimestamped } from "$lib/wasmTypesGlue";
  import Clock from "./Clock.svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { Status } from "$lib/game/status";
  import { createEventDispatcher } from "svelte";
  import todo from "ts-todo";

  export let game: {
    id: string;
    status: Status;
    moves: MoveTimestamped[];
    timeControl: TimeControl;
    playerColor: Color;
  };

  export let gameStore: GameStore;
  export let drawOffer: { from: Color } | null;

  const modalStore = getModalStore();

  const dispatch = createEventDispatcher<{
    drawOffer: void;
    drawAccepted: void;
    resignation: void;
  }>();

  function resign() {
    modalStore.trigger({
      type: "confirm",
      title: "Are you sure you want to resign?",
      modalClasses: "w-fit",
      response: (response) => {
        if (response) {
          dispatch("resignation");
        }
      },
    });
  }
</script>

<div class="w-full h-full flex flex-col md:flex-row justify-around md:gap-4">
  <div
    class="board-wrapper md:px-2 order-2 md:order-1 py-4 overflow-hidden flex-shrink"
  >
    <BoardManaged on:move game={gameStore} playerColor={game.playerColor} />
  </div>

  <div
    class="flex flex-col gap-2 md:gap-4 order-1 md:order-2 w-full md:w-fit px-4 my-auto"
  >
    <div class="pt-2">
      <Clock
        moves={game.status.inProgress
          ? $gameStore.allMoves
          : $gameStore.viewingMoves}
        timeControl={game.timeControl}
        playerColor={game.playerColor}
        on:outOfTime
        currentlyRunning={game.status.inProgress}
      />
    </div>

    <div class="w-full flex gap-2">
      {#if drawOffer}
        {#if drawOffer.from === game.playerColor}
          <button class="btn variant-soft-secondary flex-1" disabled>
            Undo offer TODO
          </button>
        {:else}
          <button class="btn variant-ghost-warning flex-1" on:click={() => dispatch("drawAccepted")}>
              Accept draw
          </button>
        {/if}
      {:else}
        <button class="btn variant-soft-secondary flex-1" on:click={() => dispatch("drawOffer")}>
          Offer draw
        </button>
      {/if}

      <button class="btn variant-soft-tertiary flex-1" on:click={resign}>
        Resign
      </button>
    </div>
  </div>
</div>

<!-- TODO: This seems to not be necessary?? -->
<!-- <style lang="postcss">
	.board-wrapper {
	  width: min(var(--screen-without-nav), 100%);
	  height: min(var(--screen-without-nav), 100vw);
	}
  </style> -->
