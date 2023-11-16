import type { Color } from "$engine/chessagon";

export class TimeControl {
  constructor(
    public minutes: number,
    public increment: number,
  ) {}

  toString(): string {
    return `${this.minutes}+${this.increment}`;
  }

  /**
   * The average total time of a game given its length, in seconds.
   *
   * Default game length is 40 moves.
   */
  public totalTime(gameLenth: number = 40): number {
    return (2 * (this.minutes * 60 + this.increment * gameLenth)) / 60;
  }

  public formatedTotalTime(gameLenth: number = 40): string {
    const value = Math.round(this.totalTime(gameLenth) * 10) / 10;
    return `${value}m`;
  }

  /**
   * Returns the time that a player would have if they made every move instantly.
   * The maximum time one can have with the given time control and move numeber.
   */
  // TODO: Color
  public totalTimeAvailable(moveNumber: number, color: number) {
    const increments = Math.max(Math.ceil((moveNumber - color) / 2 - 1), 0);
    return this.minutes * 60 + increments * this.increment;
  }

  public static fromDatabase({
    tc_increment,
    tc_minutes,
  }: {
    tc_increment: number;
    tc_minutes: number;
  }) {
    return new TimeControl(tc_minutes, tc_increment);
  }
}

export const timeControls: readonly TimeControl[] = [
  new TimeControl(1, 0),
  new TimeControl(2, 1),
  new TimeControl(3, 0),
  new TimeControl(3, 2),
  new TimeControl(5, 0),
  new TimeControl(5, 3),
  new TimeControl(10, 0),
  new TimeControl(10, 5),
  new TimeControl(15, 10),
  new TimeControl(30, 0),
  new TimeControl(30, 20),
] as const;

/**
 * Formats a number as MM:SS. Throws if the number is too large.
 *
 * Returns 00:00 if the number is negative.
 */
export function formatTime(seconds: number): string {
  seconds = Math.max(seconds, 0);
  const minutes = Math.floor(seconds / 60);
  if (minutes > 99) {
    throw new Error(
      `Time is too long to format (${minutes} minutes, ${seconds} seconds)`,
    );
  }

  const secondsLeft = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secondsLeft
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Calculates the time elapsed for a given color, in seconds
 */
export function calculateTimeRemaining(
  moves: { timestamp: Date }[],
  color: Color,
  timeControl: TimeControl,
  currentlyRunning = true,
): number {
  const timeElapsed = calculateTimeElapsed(moves, color, currentlyRunning);
  const totalTime = timeControl.totalTimeAvailable(moves.length, color);

  return totalTime - timeElapsed;
}

/**
 * Calculates the time elapsed for a given color, in seconds
 */
export function calculateTimeElapsed(
  moves: { timestamp: Date }[],
  color: Color,
  currentlyRunning = true,
): number {
  let timestamps = moves.map((move) => move.timestamp.getTime());
  timestamps[timestamps.length] = Date.now();

  let output = 0;
  for (
    let i = 2;
    i <= (currentlyRunning ? moves.length : moves.length - 1);
    i += 2
  ) {
    output += timestamps[i] - timestamps[i - 1];
  }

  return output / 1000;
}
