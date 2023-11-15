<script lang="ts">
  import { Color } from "$engine/chessagon";
  import Tile from "$lib/board/Tile.svelte";
  import { formatStatus, type Status } from "$lib/game/status";

  export let overrideHide: boolean = false;
  export let status: Status;
  export let gameId: string;

  $: show = !status.inProgress && !overrideHide;

  let title: string;
  let subtitle: string;

  $: if (!status.inProgress) {
    ({ title, subtitle } = formatStatus(status))
  };
</script>

<!-- {#if show} -->
<!-- {#if () !== null} -->
<div
  class="{show
    ? 'opacity-100'
    : 'opacity-0 pointer-events-none'} transition duration-1000 absolute w-full h-full grid gap-4 place-content-center backdrop-blur-lg backdrop-brightness-50 px-2"
>
  <h1 class="text-8xl font-black text-center">
    {title}
  </h1>
  <h2 class="text-3xl font-thin text-center">
    {subtitle}
  </h2>
  <div class="flex flex-col sm:flex-row gap-8">
    <a href="/play" class="flex-1 text-xl btn variant-filled-tertiary w-full">
      Start new game
    </a>
    <a
      href="/game/{gameId}"
      class="flex-1 text-xl btn variant-soft-tertiary w-full"
    >
      See game
    </a>
  </div>
</div>
<!-- {/if} -->
<!-- {/if} -->
