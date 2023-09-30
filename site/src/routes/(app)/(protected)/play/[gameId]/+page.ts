import { GameState, Vector } from "$engine/chessagon";
import type { Database } from "$lib/db/generatedTypes.js";
import { handleSupabaseResponse } from "$lib/db/utils";
import { TimeControl } from "$lib/timeControls.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "@sveltejs/kit";

export async function _getMoves(
  supabase: SupabaseClient<Database>,
  gameId: string,
) {
  const dbPromise = supabase
    .from("live_moves")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: true });

  const moves = handleSupabaseResponse(await dbPromise) ?? [];

  return moves.map((move) => {
    const origin = new Vector(move.origin_x, move.origin_y);
    const target = new Vector(move.target_x, move.target_y);

    return { origin, target };
  });
}

export async function load({ parent, params, depends }) {
  depends(`game:${params.gameId}`);

  const { supabase, session } = await parent();

  const response = await supabase
    .from("live_games")
    .select(
      "id, tc_minutes, tc_increment, challenger_color, acceptant_id, challenger_id",
    )
    .eq("id", params.gameId)
    .maybeSingle();

  const game = handleSupabaseResponse(response);

  // TODO: Make it so that it prompts to join when entering the page if the game is not active and not yours
  if (
    game === null ||
    (game.challenger_id !== session.user.id &&
      game.acceptant_id !== session.user.id)
  ) {
    throw redirect(303, "/play");
  }

  const isActive = Boolean(game.acceptant_id);

  const mainGameData = {
    timeControl: new TimeControl(game.tc_minutes, game.tc_increment),
    challenger: {
      color: game.challenger_color,
      id: game.challenger_id,
    },
    id: game.id,
  };

  if (isActive) {
    return {
      game: {
        ...mainGameData,
        isActive: true as const,
        moves: await _getMoves(supabase, params.gameId),
        color:
          game.challenger_id === session.user.id
            ? game.challenger_color
            : 1 - game.challenger_color,
      },
    };
  } else {
    return {
      game: {
        ...mainGameData,
        isActive: false as const,
      },
    };
  }
}
