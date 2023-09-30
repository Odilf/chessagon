import { handleSupabaseResponse } from "$lib/db/utils";
import { TimeControl } from "$lib/timeControls.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, params, depends }) {
  depends(`game:${params.gameId}`);

  const { supabase, session } = await parent();

  const response = await supabase
    .from("live_games")
    .select("id, tc_minutes, tc_increment, challenger_color, acceptant_id, challenger_id")
    .eq("id", params.gameId)
    .maybeSingle();
  const game = handleSupabaseResponse(response);

  // TODO: Make it so that it prompts to join when entering the page if the game is not active and not yours
  if (game === null || (game.challenger_id !== session.user.id && game.acceptant_id !== session.user.id)) {
    throw redirect(303, "/play");
  }

  return {
    game: {
      timeControl: new TimeControl(game.tc_minutes, game.tc_increment),
      challenger: {
        color: game.challenger_color,
		id: game.challenger_id,
      },
      id: game.id,
	  isActive: Boolean(game.acceptant_id),
    },
  };
}
