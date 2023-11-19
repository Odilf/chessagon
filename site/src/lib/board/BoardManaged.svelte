<script lang="ts">
  import type { Color, Piece } from "$engine/chessagon";
  import type { Move } from "$lib/wasmTypesGlue";
  import { createEventDispatcher } from "svelte";
  import Board, { positions } from "./Board.svelte";
  import {
    getStatusFromCode,
    type DrawReason,
    type WinReason,
  } from "$lib/game/status";
  import type { GameStore } from "./gameStore";
  import { like } from "drizzle-orm";

  export let game: GameStore;
  export let playerColor: Color;

  export const turn = () =>
    game.turn() === playerColor ? ("player" as const) : ("opponent" as const);

  let selected: Piece | null = null;

  $: highlightPositions = positions.filter(
    (position) =>
      selected &&
      $game.moveIndex === $game.allMoves.length &&
      selected.color === playerColor &&
      ($game.state.can_move(selected.position, position) ||
        selected.position.toString() == position.toString()), // TODO: Uggo
  );

  const dispath = createEventDispatcher<{
    move: Move;
    invalidMove: { value: Move; reason: string };
    result:
      | { winner: Color; reason: WinReason }
      | { winner: null; reason: DrawReason };
  }>();

  $: status = getStatusFromCode($game.state.status_code());
  $: if (status && !status.inProgress) {
    dispath("result", status);
  }

  export function makeMove(move: Move) {
    if (turn() === "player") {
      selected = null;
    }

    try {
      game.makeMove(move);
    } catch (err) {
      dispath("invalidMove", {
        value: move,
        reason: "TODO: implement reason",
      });

      return;
    }

    dispath("move", move);
  }
</script>

<!-- @component
A managed board which has all the logic for managing the game state and doing moves. However, it is just
the board part, so it doesn't have a clock and doesn't handle any draw requests or offers or anything of the like.

It dispatches events for moves, which are guaranteed to be valid. Also for invalid moves and results.

Also handles history.
 -->

<svelte:window
  on:keydown={(e) => {
    if (e.key === "ArrowRight") {
      game.updateMoveIndex((i) => i + 1);
    } else if (e.key === "ArrowLeft") {
      game.updateMoveIndex((i) => i - 1);
    }
  }}
/>

<Board
  {playerColor}
  board={$game.state.board}
  bind:selected
  {highlightPositions}
  on:move={({ detail: move }) => makeMove(move)}
/>
