import { Color, Vector } from "$engine/chessagon.js";
import { TimeControl } from "$lib/timeControls.js";

export async function load({ data }) {
  const { game, playerColor } = data;

  return {
    game: {
      isActive: game.white && game.black,
      timeControl: new TimeControl(game.tc_minutes, game.tc_increment),
      ...game,
      moves: game.moves.map(
        ({ index, origin_x, origin_y, target_x, target_y, timestamp }) => ({
          index,
          origin: new Vector(origin_x, origin_y),
          target: new Vector(target_x, target_y),
          timestamp,
        }),
      ),
    },
    playerColor,
  };
}
