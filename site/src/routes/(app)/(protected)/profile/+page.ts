import { handleSupabaseResponse } from "$lib/db/utils";
import { error as skError } from "@sveltejs/kit";

export async function load({ parent }) {
  const { supabase, session } = await parent();

  const response = await supabase
    .from("profiles")
    .select("id, username, rating")
    .eq("id", session.user.id)
    .single();
  const profile = handleSupabaseResponse(response);

  if (profile === null) {
    throw skError(404, "Profile not found");
  }

  return {
    profile: profile,
  };
}
