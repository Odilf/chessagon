// import { Color, GameState, Vector } from "$engine/chessagon.js";
// import { error } from "@sveltejs/kit";
// import { _getMoves } from "../+page.js";
// // import { handleSupabaseResponse } from "$lib/db/utils.js";
// import { getStatusFromCode } from "$lib/game/status.js";
// // import type { SupabaseClient } from "@supabase/supabase-js";
// // import type { Database } from "$lib/db/generatedTypes.js";
// import { TimeControl } from "$lib/timeControls.js";

// async function readBody(request: Request) {
//   if (request.body === null) {
//     throw error(400, "request body is null");
//   }

//   const readPromise = request.body.getReader().read();
//   const array = await readPromise;

//   if (!array.value) {
//     throw error(400, "array can't be read somehow i think");
//   }

//   const [origin_x, origin_y, target_x, target_y] = new Int8Array(array.value);
//   const origin = new Vector(origin_x, origin_y);
//   const target = new Vector(target_x, target_y);

//   return { origin, target };
// }

// function gameFromMoves(moves: { origin: Vector; target: Vector }[]): GameState {
//   const game = new GameState();

//   for (const { origin, target } of moves) {
//     game.try_move(origin, target);
//   }

//   return game;
// }

// export async function POST({
//   params: { gameId },
//   request,
//   locals: { supabase },
// }) {
//   const { origin, target } = await readBody(request);
//   const moves = await _getMoves(supabase, gameId);

//   let game: GameState;

//   try {
//     game = gameFromMoves(moves);
//   } catch {
//     throw error(500, "MALFORMED");
//   }

//   try {
//     game.try_move(origin, target);
//   } catch {
//     throw error(403, "Illegal move");
//   }

//   const response = await supabase.from("live_moves").insert({
//     origin_x: origin.x,
//     origin_y: origin.y,
//     target_x: target.x,
//     target_y: target.y,
//     game_id: gameId,
//   });

//   handleSupabaseResponse(response);

//   const status = game.status_code();
//   console.log(status);

//   if (getStatusFromCode(status)?.inProgress === false) {
//     await archiveGame(supabase, gameId, status, [...moves, { origin, target, created_at: Date.now() / 1000 }]);
//   }

//   return new Response(null, { status: 200 });
// }

// async function archiveGame(
//   supabase: SupabaseClient<Database>,
//   gameId: string,
//   status_code: number,
//   moves: { origin: Vector; target: Vector, created_at: number }[]
// ) {
//   console.log("archiving game");

//   const responseLiveGames = await supabase
//     .from("live_games")
//     .select("id, challenger_id, acceptant_id, challenger_color, tc_minutes, tc_increment, started_at")
//     .eq("id", gameId)
//     .single();

//   const liveGame = handleSupabaseResponse(responseLiveGames);

//   if (liveGame === null) {
//     throw error(404, "Game not found");
//   }

//   if (liveGame.acceptant_id === null || liveGame.started_at === null) {
//     throw error(400, "Game seems to not be started (probably something went wrong)");
//   }

//   const timeControl = new TimeControl(liveGame.tc_minutes, liveGame.tc_increment)

//   const archiveGame = supabase.from("games").insert({
//     id: liveGame.id,
//     white_id: liveGame.challenger_color === Color.White ? liveGame.challenger_id : liveGame.acceptant_id,
//     black_id: liveGame.challenger_color === Color.Black ? liveGame.challenger_id : liveGame.acceptant_id,
//     result_code: status_code,
//     tc_minutes: liveGame.tc_minutes,
//     tc_increment: liveGame.tc_increment,
//     started_at: liveGame.started_at,
//   });

//   const removeGame = supabase.from("live_games").delete().eq("id", gameId);

//   const timeStarted = new Date(liveGame.started_at);

//   await Promise.all([archiveGame, removeGame]);

//   await supabase.from("moves").insert(moves.map(({ origin, target, created_at }, i) => {
//     return {
//       origin_x: origin.x,
//       origin_y: origin.y,
//       target_x: target.x,
//       target_y: target.y,
//       game_id: gameId,
//       time_remaining: timeControl.timeRemaining(timeStarted, i, new Date(created_at)),
//     }
//   }))
// }
