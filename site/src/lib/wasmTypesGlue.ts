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

export function calculateTimeRemaining(
  moves: { timestamp: Date }[],
  color: ColorEnum,
  timeStarted: Date,
  timeControl: TimeControl,
): number {
  const timeElapsed = calculateTimeElapsed(moves, color, timeStarted);
  const totalTime = timeControl.totalTimeAvailable(moves.length, color);

  return totalTime - timeElapsed;
}

/**
 * Calculates the time elapsed for a given color, in seconds
 */
export function calculateTimeElapsed(
  moves: { timestamp: Date }[],
  color: ColorEnum,
  timeStarted: Date,
): number {
  let timestamps = moves.map((move) => move.timestamp);

  // Boundary conditions
  timestamps[-1] = timeStarted;
  timestamps[timestamps.length] = new Date();

  let output = 0;
  for (let i = color; i < moves.length; i += 2) {
    output += timestamps[i].getTime() - timestamps[i - 1].getTime();
  }

  return output / 1000;
}
