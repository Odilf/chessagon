import type { SupabaseClient, Session } from "@supabase/supabase-js";
import type { Database } from "$lib/db/types";

declare global {
  // See https://kit.svelte.dev/docs/types#app
  // for information about these interfaces
  // and what to do when importing types
  declare namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      getSession(): Promise<Session | null>;
    }
    // interface Platform {}
    // interface PrivateEnv {}
    // interface PublicEnv {}
    // interface Session {}
    // interface Stuff {}
  }
}
