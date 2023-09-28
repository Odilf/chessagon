import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_ANON_KEY_DEV,
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_URL_DEV,
} from "$env/static/public";
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit";
import type { Database } from "$lib/db/types";
import { dev } from "$app/environment";

export const load = async ({ fetch, data, depends }) => {
  depends("supabase:auth");

  const supabase = createSupabaseLoadClient<Database>({
    supabaseUrl: dev ? PUBLIC_SUPABASE_URL_DEV : PUBLIC_SUPABASE_URL,
    supabaseKey: dev ? PUBLIC_SUPABASE_ANON_KEY_DEV : PUBLIC_SUPABASE_ANON_KEY,
    event: { fetch },
    serverSession: data.session,
  });

  // TODO: What the hell
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()

  const session = data.session;

  // const huh = await parent();

  return { session, supabase };
};
