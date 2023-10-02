<script lang="ts">
  import type { GameState, Color, Piece, Vector } from "$engine/chessagon";
  import { createEventDispatcher } from "svelte";
  import Board, { positions } from "./Board.svelte";
  import {
    getStatusFromCode,
    type DrawReason,
    type WinReason,
  } from "$lib/game/status";

  export let game: GameState;
  export let playerColor: Color;

  let selected: Piece | null = null;

  $: highlightPositions = positions.filter((position) =>
    selected
      ? selected.color === playerColor &&
        (game.can_move(selected.position, position) ||
          selected.position.toString() == position.toString()) // TODO: Uggo
      : false,
  );

  const dispath = createEventDispatcher<{
    move: { from: Vector; to: Vector };
    invalidMove: { from: Vector; to: Vector; reason: string };
    result:
      | { winner: Color; reason: WinReason }
      | { winner: null; reason: DrawReason };
  }>();

  $: status = getStatusFromCode(game.status_code());
  $: if (!status?.inProgress) {
    if (status?.winner) {
      dispath("result", { winner: status.winner, reason: status.reason });
    }
  }
</script>

<Board
  {playerColor}
  board={game.board}
  bind:selected
  {highlightPositions}
  on:move={({ detail: { from, to } }) => {
    selected = null;
    if (game.can_move(from, to)) {
      dispath("move", { from, to });
    } else {
      dispath("invalidMove", { from, to, reason: "TODO: implement reason" });
    }
  }}
/>
