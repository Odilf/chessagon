import { Color, Vector } from "$engine/chessagon.js";
import { TimeControl } from "$lib/timeControls.js";

export async function load({ data, parent }) {
  const { session } = await parent()
  const { game } = data;
  return {
    game: {
      ...game,
      moves: game.moves.map((move) => ({
        origin: new Vector(move.origin_x, move.origin_y),
        target: new Vector(move.target_x, move.target_y),
        timestamp: move.timestamp,
      })),
      timeControl: TimeControl.fromDatabase(game),
    },
    playerColor: game.white?.id === session.user.id ? Color.White : Color.Black,
  };
}
