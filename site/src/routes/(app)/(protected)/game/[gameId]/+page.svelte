<script lang="ts">
  import FullBoard from "$lib/board/FullBoard.svelte";
  import { createGameStore } from "$lib/board/gameStore.js";

  export let data;

  let gameStore = createGameStore(data.game.moves);
</script>

<FullBoard
  {gameStore}
  inProgress={false}
  timeControl={data.game.timeControl}
  playerColor={data.playerColor}
  interactive={false}
  drawOffer={null}
/>
