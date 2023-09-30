<script lang="ts">
  import { GameState, type Color, Piece, Vector } from "$engine/chessagon";
  import { createEventDispatcher } from "svelte";
  import Board, { positions } from "./Board.svelte";

  export let game: GameState = new GameState();
  export let playerColor: Color;

  let selected: Piece | null = null;

  $: highlightPositions = positions.filter((position) =>
    selected
      ? selected.color === playerColor &&
        (game.can_move(selected.position, position) ||
          selected.position.toString() == position.toString()) // TODO: Uggo
      : false
  );

  const dispath = createEventDispatcher<{
    move: { from: Vector; to: Vector };
    invalidMove: { from: Vector; to: Vector; reason: string };
  }>();
</script>

<Board
  {playerColor}
  bind:board={game.board}
  bind:selected
  {highlightPositions}
  on:move={({ detail: { from, to } }) => {
    if (game.can_move(from, to)) {
      dispath("move", { from, to });
    } else {
      dispath("invalidMove", { from, to, reason: "TODO: implement reason" });
    }
  }}
/>
