<script lang="ts">
  import type { Color } from "$engine/chessagon";
  import {
    TimeControl,
    calculateTimeRemaining,
    formatTime,
  } from "$lib/timeControls";
  import { createEventDispatcher, onDestroy } from "svelte";

  export let moves: { timestamp: Date }[];
  export let playerColor: Color;
  export let timeControl: TimeControl;
  export let currentlyRunning = true;

  const dispatch = createEventDispatcher<{ outOfTime: void }>();

  const getTime = () => ({
    player: calculateTimeRemaining(
      moves,
      playerColor,
      timeControl,
      currentlyRunning
    ),
    opponent: calculateTimeRemaining(
      moves,
      1 - playerColor,
      timeControl,
      currentlyRunning
    ),
  });

  let time = getTime();

  const timeRemainingInterval = setInterval(async () => {
    time = getTime();

    if (time.player <= 0 || time.opponent <= 0) {
      dispatch("outOfTime");
      clearInterval(timeRemainingInterval);
    }
  }, 100);

  onDestroy(() => {
    clearInterval(timeRemainingInterval);
  });

  $: turn = moves.length % 2;
</script>

<div class="card variant-ghost-surface p-4 flex lg:flex-col lg:px-8">
  <div class="{turn === playerColor && "opacity-50"} transition flex-1 font-bold text-2xl lg:text-center -z-10">
    Opponent
    <div class="font-mono font-thin text-3xl">
      {formatTime(time.opponent)}
    </div>
  </div>

  <div
    class="{turn === playerColor
      ? 'lg:rotate-90'
      : 'lg:-rotate-90 rotate-180'} w-fit transition-transform py-4 mx-4 lg:mx-auto text-surface-400 -z-10"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="4"
      stroke="currentColor"
      class="w-8 h-8"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
      />
    </svg>
  </div>

  <div class="{turn !== playerColor && "opacity-50"} transition flex-1 font-bold text-2xl text-right lg:text-center -z-10">
    You
    <div class="font-mono font-thin text-3xl">
      {formatTime(time.player)}
    </div>
  </div>
</div>
