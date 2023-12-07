import { Color } from "$engine/chessagon";
import { TimeControl } from "$lib/timeControls";

export async function load({ data }) {
  console.log("Got data (in universal): ", JSON.stringify(data));
  return {
    games: data.games.map((game) => ({
      id: game.id,
      host: {
        username: game.white?.name ?? game.black?.name ?? "Unknown",
        color: game.white ? Color.White : Color.Black,
      },
      timeControl: new TimeControl(game.tc_minutes, game.tc_increment),
      numMoves: game.moves.length,
    })),
  };
}
