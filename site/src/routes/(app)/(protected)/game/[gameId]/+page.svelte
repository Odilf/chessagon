<script lang="ts">
  import { Color } from "$engine/chessagon.js";
  import Board from "$lib/board/Board.svelte";
  import { gameFromMoves } from "$lib/wasmTypesGlue.js";

	export let data;

	let gameState = gameFromMoves(data.game.moves);
</script>

<Board playerColor={Color.White}  />
