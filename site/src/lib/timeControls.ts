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
    const increment = Math.ceil(moveNumber / 2 - color) * this.increment;
    return this.minutes * 60 + increment;
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
