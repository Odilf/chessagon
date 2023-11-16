import { GameState, Vector} from "$engine/chessagon";

export type Move = { origin: Vector; target: Vector };
export type MoveTimestamped = Move & { timestamp: Date };
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

export function moveFromDatabase({
  origin_x,
  origin_y,
  target_x,
  target_y,
}: {
  origin_x: number;
  origin_y: number;
  target_x: number;
  target_y: number;
}): Move {
  return {
    origin: new Vector(origin_x, origin_y),
    target: new Vector(target_x, target_y),
  };
}
