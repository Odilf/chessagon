<script lang="ts">
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import type { GameStore } from "$lib/board/gameStore";
  import type { TimeControl } from "$lib/timeControls";
  import type { Color } from "$engine/chessagon";
  import type { Move } from "$lib/wasmTypesGlue";
  import Clock from "./Clock.svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import todo from "ts-todo";
  import { IN_PROGRESS } from "$lib/game/status";

  export let game: {
    id: string;
    status_code: number;
    moves: (Move & { timestamp: Date })[];
    timeControl: TimeControl;
    playerColor: Color;
  };

  export let gameStore: GameStore;

  const modal = getModalStore();

  function offerDraw() {
    modal.trigger({
      type: "confirm",
      title: "Are you sure you want to offer a draw?",
      modalClasses: "w-fit",
      response: (response) => {
        if (response) {
          // TODO: Implement draw offer
          todo();
        }
      },
    });
  }

  function resign() {
    modal.trigger({
      type: "confirm",
      title: "Are you sure you want to resign?",
      modalClasses: "w-fit",
      response: (response) => {
        if (response) {
          // TODO: Implement resigning
          todo();
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
        moves={game.status_code === IN_PROGRESS ? $gameStore.allMoves : $gameStore.viewingMoves}
        timeControl={game.timeControl}
        playerColor={game.playerColor}
        on:outOfTime
        currentlyRunning={game.status_code === IN_PROGRESS}
      />
    </div>

    <div class="w-full flex gap-2">
      <button class="btn variant-soft-secondary flex-1" on:click={offerDraw}>
        Offer draw
      </button>
      <button
        class="btn variant-soft-tertiary flex-1"
        on:click={resign}
      >
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
