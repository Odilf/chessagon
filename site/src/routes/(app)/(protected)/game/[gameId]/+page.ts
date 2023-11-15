import { Vector } from "$engine/chessagon.js";

export async function load({ data }) {
  const { game } = data;
  return {
    game: {
      ...game,
      moves: game.moves.map((move) => ({
        origin: new Vector(move.origin_x, move.origin_y),
        target: new Vector(move.target_x, move.target_y),
        timestamp: move.timestamp,
      })),
    },
  };
}
