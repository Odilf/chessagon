import { Color, type GameState } from "$engine/chessagon";
import {
  gameFromMoves,
  type Move,
  type MoveTimestamped,
} from "$lib/wasmTypesGlue";
import { writable } from "svelte/store";

export function createGameStore(
  moves: MoveTimestamped[],
  preventDuplicateMoves = true,
) {
  moves;
  let moveIndex = moves.length;
  const { set, update, subscribe } = writable<{
    state: GameState;
    moveIndex: number;
    allMoves: MoveTimestamped[];
    viewingMoves: MoveTimestamped[];
  }>();

  set({
    state: gameFromMoves(moves),
    moveIndex,
    allMoves: moves,
    viewingMoves: moves.slice(0, moveIndex),
  });

  const updateState = (callback: (game: { state: GameState }) => unknown) => {
    update((game) => {
      callback(game);
      return game;
    });

    setMoveIndex(moves.length);
  };

  const setMoveIndex = (index: number = moves.length - 1) => {
    // Clamp
    moveIndex = Math.max(0, Math.min(moves.length, index));
    const viewingMoves = moves.slice(0, moveIndex);
    set({
      state: gameFromMoves(viewingMoves),
      moveIndex,
      allMoves: moves,
      viewingMoves,
    });
  };

  const updateMoveIndex = (updater: (index: number) => number) => {
    setMoveIndex(updater(moveIndex));
  };

  const makeMove = (move: Move) => {
    if (preventDuplicateMoves) {
      const lastMove = moves[moves.length - 1];
      // TODO: Uggo
      if (
        lastMove &&
        lastMove.origin.toString() === move.origin.toString() &&
        lastMove.target.toString() === move.target.toString()
      ) {
        return;
      }
    }

    moves.push({ ...move, timestamp: new Date() });
    updateState(({ state }) => {
      state.try_move(move.origin, move.target);
    });
  };

  const undoLastMove = () => {
    updateState((game) => {
      game.state = gameFromMoves(moves);
    });

    setMoveIndex(moves.length);
  };

  const turn = () => (moves.length % 2 === 0 ? Color.White : Color.Black);

  return {
    subscribe,
    refresh: () => update((game) => game),

    setMoveIndex,
    updateMoveIndex,

    makeMove,
    undoLastMove,

    turn,
  };
}

export type GameStore = ReturnType<typeof createGameStore>;
