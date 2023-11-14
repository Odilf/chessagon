import { GameState, Vector, type Color as ColorEnum } from "$engine/chessagon";
import type { TimeControl } from "./timeControls";

export type Move = { origin: Vector; target: Vector };
export type Color = "white" | "black";

/**
 * Creates a game from a set of moves
 */
export function gameFromMoves(moves: Move[]): GameState {
  const game = new GameState();

  for (const { origin, target } of moves) {
    game.try_move(origin, target);
  }

  return game;
}
