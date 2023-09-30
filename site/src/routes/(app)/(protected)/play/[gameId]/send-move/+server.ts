import { GameState, Vector } from "$engine/chessagon.js";
import { error } from "@sveltejs/kit";
import { _getMoves } from "../+page.js";
import { handleSupabaseResponse } from "$lib/db/utils.js";

export async function POST({ params: { gameId }, request, locals }) {
  const { supabase } = locals;

  if (request.body === null) {
    throw error(400, "request body is null");
  }

  const readPromise = request.body.getReader().read();
  const array = await readPromise;

  if (!array.value) {
    throw error(400, "array can't be read somehow i think");
  }

  const [origin_x, origin_y, target_x, target_y] = new Int8Array(array.value);
  const origin = new Vector(origin_x, origin_y);
  const target = new Vector(target_x, target_y);

  const moves = await _getMoves(supabase, gameId);

  const game = new GameState();

  moves.forEach(({ origin, target }) => {
    try {
      game.try_move(origin, target);
    } catch {
      throw error(400, "MALFORMED");
    }
  });

  try {
    game.try_move(origin, target);
  } catch {
    throw error(403, "Illegal move");
  }

  const response = await supabase.from("live_moves").insert({
    origin_x: origin.x,
    origin_y: origin.y,
    target_x: target.x,
    target_y: target.y,
    game_id: gameId,
  });

  handleSupabaseResponse(response);

  console.log("move sent");

  return new Response(null, { status: 200 });
}
