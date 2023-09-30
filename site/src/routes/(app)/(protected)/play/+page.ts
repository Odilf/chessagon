import { redirect } from "@sveltejs/kit";

export async function load({ parent }) {
  const { supabase, session } = await parent();

  // Run both promises at the same time, but handle the first one first
  const playerGamePromise = supabase
    .from("live_games")
    .select()
    .eq("challenger_id", session.user.id)
    .single();
  const nonPlayerGamesPromise = supabase
    .from("live_games")
    .select(
      "id, tc_minutes, tc_increment, challenger_color, profiles!live_games_challenger_id_fkey (username)",
    )
    .neq("challenger_id", session.user.id);

  // Scope to prevent changing names
  {
    const { data, error } = await playerGamePromise;

    if (!error && data) {
      throw redirect(303, `/play/${data.id}`);
    }
  }

  return {
    games: nonPlayerGamesPromise,
  };
}
