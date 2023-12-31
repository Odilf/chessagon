import { Color, Vector } from "$engine/chessagon.js";
import { getStatusFromCode } from "$lib/game/status.js";
import { TimeControl } from "$lib/timeControls.js";

export async function load({ data }) {
  const { game, playerColor } = data;

  return {
    game: {
      isActive: game.white && game.black,
      timeControl: new TimeControl(game.tc_minutes, game.tc_increment),
      status: getStatusFromCode(game.status_code)!,
      ...game,
      moves: game.moves.map(
        ({ origin_x, origin_y, target_x, target_y, timestamp }) => ({
          origin: new Vector(origin_x, origin_y),
          target: new Vector(target_x, target_y),
          timestamp,
        }),
      ),
    },
    playerColor,
  };
}
