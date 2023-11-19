<script lang="ts">
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import type { GameStore } from "$lib/board/gameStore";
  import type { TimeControl } from "$lib/timeControls";
  import type { Board, Color } from "$engine/chessagon";
  import Clock from "./Clock.svelte";
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { createEventDispatcher } from "svelte";

  export let gameStore: GameStore;
  export let drawOffer: { from: Color } | null;

  export let inProgress: boolean;
  export let timeControl: TimeControl;
  export let playerColor: Color;

  export let interactive: boolean;

  const modalStore = getModalStore();

  const dispatch = createEventDispatcher<{
    drawOffer: void;
    drawAccepted: void;
    resignation: void;
    drawOfferRetraction: void;
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

<!-- @component
The full daddy board. The only thing this doesn't do is fetch and broadcast.

It dispatches events for:
- Everything `BoardManaged` dispatches
- drawOffer
- drawAccepted
- resignation
- drawOfferRetraction
 -->

<div
  class="w-full h-full flex flex-col lg:flex-row justify-around lg:gap-4 {interactive
    ? ''
    : 'pointer-events-none'}"
>
  <div
    class="board-wrapper lg:px-2 order-2 lg:order-1 py-4 overflow-hidden flex-shrink"
  >
    <BoardManaged on:move game={gameStore} {playerColor} />
  </div>

  <div
    class="flex flex-col gap-2 lg:gap-4 order-1 lg:order-2 w-full lg:w-72 px-4 my-auto"
  >
    <div class="pt-2">
      <Clock
        moves={inProgress ? $gameStore.allMoves : $gameStore.viewingMoves}
        {timeControl}
        {playerColor}
        on:outOfTime
        currentlyRunning={inProgress}
      />
    </div>

    {#if interactive}
      <div class="w-full grid grid-cols-2 gap-2">
        {#if drawOffer}
          {#if drawOffer.from === playerColor}
            <button
              class="btn variant-soft-warning"
              on:click={() => dispatch("drawOfferRetraction")}
            >
              Retract offer
            </button>
          {:else}
            <button
              class="btn variant-ghost-warning"
              on:click={() => dispatch("drawAccepted")}
            >
              Accept draw
            </button>
          {/if}
        {:else}
          <button
            class="btn variant-soft-secondary"
            on:click={() => dispatch("drawOffer")}
          >
            Offer draw
          </button>
        {/if}

        <button class="btn variant-soft-tertiary" on:click={resign}>
          Resign
        </button>
      </div>
    {/if}
  </div>
</div>

<!-- TODO: This seems to not be necessary?? -->
<!-- <style lang="postcss">
	.board-wrapper {
	  width: min(var(--screen-without-nav), 100%);
	  height: min(var(--screen-without-nav), 100vw);
	}
  </style> -->
