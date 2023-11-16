<script lang="ts">
  import LiveBoard from "$lib/board/LiveBoard.svelte";
  import { createGameStore } from "$lib/board/gameStore.js";

  export let data;

  let gameStore = createGameStore(data.game.moves);
</script>

<LiveBoard
  {gameStore}
  inProgress={false}
  timeControl={data.game.timeControl}
  playerColor={data.playerColor}
  interactive={false}
  drawOffer={null}
/>
