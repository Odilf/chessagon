import type { Color } from "$engine/chessagon";

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

export const gameFinishedEvent = "game-finished";
export const drawOffer = (from: Color) => `draw-offer-${from}`;
export const resignation = "resignation";
