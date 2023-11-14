import { Color, GameState, Vector } from "$engine/chessagon.js";
import { error } from "@sveltejs/kit";
import { db } from "$lib/db/index.js";
import { games, moves } from "$lib/db/schema.js";
import { eq } from "drizzle-orm";
import { pusher } from "$lib/pusher/server.js";
import { gameChannel, newMoveEventName } from "$lib/pusher/events";
import { gameFromMoves } from "$lib/wasmTypesGlue.js";
import { receiveMove } from "$lib/db/actions/server";

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

export async function POST({ params, request, locals }) {
  const [move, session] = await Promise.all([
    readBody(request),
    locals.auth.validate(),
  ]);

  await receiveMove(session.user.id, params.gameId, move);
  return new Response(null, { status: 200 });
}
