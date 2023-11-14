/**
 * Channel that contains general info on games (e.g.: what games )
 */
export const generalGameChannel = "games-room";
export const gameUpdateEvent = "game-room-update";

// Specific game
export const gameChannel = (gameId: string) => `game-${gameId}`;
export const gameStartedEvent = "game-started";
export const newMoveEventName = "new-move";
export type NewMoveEventData = {
  origin: { x: number; y: number };
  target: { x: number; y: number };
};
