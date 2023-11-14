import type { GameState } from "$engine/chessagon";
import { gameFromMoves, type Move } from "$lib/wasmTypesGlue";
import { writable } from "svelte/store";

export function createGameStore(moves: Move[]) {
  const { set, update, subscribe } = writable<GameState>();

  set(gameFromMoves(moves));

  return {
    set,
    makeMove: (move: Move) =>
      update((game) => {
        game.try_move(move.origin, move.target);
        moves.push(move);
        return game;
      }),
    undoLastMove: () =>
      update((game) => {
        // TODO: Make this actually efficient with an `Board::undo_move_unchecked` or smth function exported from rust
        const lastMove = moves.pop();
        try {
          game = gameFromMoves(moves);
        } catch (err) {
          lastMove && moves.push(lastMove);
        }
        return game;
      }),
    subscribe,
  };
}
