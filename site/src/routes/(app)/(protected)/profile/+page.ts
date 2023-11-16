import { Color } from "$engine/chessagon.js";
import { TimeControl } from "$lib/timeControls.js";
import { moveFromDatabase } from "$lib/wasmTypesGlue.js";

export async function load({ data }) {
  const { session, games } = data;

  return {
    session,
    games: games.map((game) => ({
      ...game,
      moves: game.moves.map(moveFromDatabase),
      playerColor: game.white === session.user.id ? Color.White : Color.Black,
      timeControl: TimeControl.fromDatabase(game),
    })),
  };
}
