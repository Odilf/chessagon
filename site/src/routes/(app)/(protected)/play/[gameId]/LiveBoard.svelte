<script lang="ts">
  import { Color } from "$engine/chessagon";
  import BoardManaged from "$lib/board/BoardManaged.svelte";
  import type { GameStore } from "$lib/board/gameStore";
  import { getStatusFromCode } from "$lib/game/status";
  import {
    calculateTimeRemaining,
    formatTime,
    TimeControl,
  } from "$lib/timeControls";
  import type { Move } from "$lib/wasmTypesGlue";
  import { createEventDispatcher, onDestroy } from "svelte";

  export let game: {
    id: string;
    status_code: number;
    moves: (Move & { timestamp: Date })[];
    timeControl: TimeControl;
    playerColor: Color;
  };

  export let gameStore: GameStore;

  const dispatch = createEventDispatcher<{ outOfTime: void }>();

  let board: BoardManaged;

  const getTimeRemaining = () => ({
    player: calculateTimeRemaining(
      game.moves,
      game.playerColor,
      game.timeControl,
    ),
    opponent: calculateTimeRemaining(
      game.moves,
      game.playerColor === Color.White ? Color.Black : Color.White,
      game.timeControl,
    ),
  });

  let timeRemaining = getTimeRemaining();

  const timeRemainingInterval = setInterval(async () => {
    timeRemaining = getTimeRemaining();
    
    if (timeRemaining.player <= 0 || timeRemaining.opponent <= 0) {
      dispatch("outOfTime");
      clearInterval(timeRemainingInterval);
    }
  }, 100);

  onDestroy(() => {
    clearInterval(timeRemainingInterval);
  });
</script>

<div class="w-full h-full flex flex-col md:flex-row justify-around">
  <div class="board-wrapper px-2 md:px-0 py-4 overflow-hidden flex-shrink">
    <BoardManaged
      bind:this={board}
      on:move
      game={gameStore}
      playerColor={game.playerColor}
    />
  </div>

  <div class="grid place-content-center">
    <span class="font-bold text-3xl">{formatTime(timeRemaining.opponent)}</span>
    <span class="font-bold text-3xl"
      >{board?.turn() === "player" ? "Your" : "Opponent's"} turn</span
    >
    <span class="font-bold text-3xl">{formatTime(timeRemaining.player)}</span>
  </div>
</div>

<!-- TODO: This seems to not be necessary?? -->
<!-- <style lang="postcss">
	.board-wrapper {
	  width: min(var(--screen-without-nav), 100%);
	  height: min(var(--screen-without-nav), 100vw);
	}
  </style> -->
