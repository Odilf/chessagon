import { Color, GameState, Vector } from "$engine/chessagon.js";
import { error } from "@sveltejs/kit";
import { db } from "$lib/db/index.js";
import { games, moves } from "$lib/db/schema.js";
import { eq, or, sql } from "drizzle-orm";
import { pusher } from "$lib/pusher/index.js";
import { gameChannel, newMoveEvent } from "$lib/pusher/events";
import type { Move } from "$lib/wasmTypesGlue";

async function readBody(request: Request) {
  if (request.body === null) {
    throw error(400, "request body is null");
  }

  const array = await request.body.getReader().read();

  if (!array.value) {
    throw error(400, "array can't be read somehow i think (TODO: Check this)");
  }

  const [origin_x, origin_y, target_x, target_y] = new Int8Array(array.value);
  const origin = new Vector(origin_x, origin_y);
  const target = new Vector(target_x, target_y);

  return { origin, target };
}

function gameFromMoves(moves: Move[]): GameState {
  const game = new GameState();

  for (const { origin, target } of moves) {
    game.try_move(origin, target);
  }

  return game;
}

export async function POST({ params, request, locals }) {
  const [{ origin, target }, session] = await Promise.all([
    readBody(request),
    locals.auth.validate(),
  ])

  const game = await db.query.games.findFirst({
    columns: {
      white: true,
      black: true,
      result_code: true,
    },
    where: eq(games.id, params.gameId),
    with: {
      white: {
        columns: {
          id: true,
        }
      },
      black: {
        columns: {
          id: true,
        }
      },
      moves: {
        columns: {
          origin_x: true,
          origin_y: true,
          target_x: true,
          target_y: true,
        }
      }
    },
  });

  if (!game) {
    return new Response("Can't access game", { status: 400 });
  }

  const color = game.moves.length % 2 === 0 ? "white" : "black" as "white" | "black";

  if (game[color]?.id !== session.user.id) {
    return new Response("Not your game or turn", { status: 403 });
  }

  const board = gameFromMoves(game.moves.map(({ origin_x, origin_y, target_x, target_y }) => ({
    origin: new Vector(origin_x, origin_y),
    target: new Vector(target_x, target_y),
  })));

  if (!board.can_move(origin, target)) {
    return new Response("Invalid move", { status: 400 });
  }

  await Promise.all([
    db.insert(moves).values({
      index: game.moves.length,
      gameId: params.gameId,
      origin_x: origin.x,
      origin_y: origin.y,
      target_x: target.x,
      target_y: target.y,
    }),

    await pusher.trigger(gameChannel(params.gameId), newMoveEvent, {
      origin,
      target,
    })
  ])

  return new Response(null, { status: 200 });
}

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
