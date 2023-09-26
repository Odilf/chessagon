import { createClient } from '@supabase/supabase-js'
import { PUBLIC_ANON_KEY, PUBLIC_SUPABASE_URL, PUBLIC_ANON_KEY_DEV, PUBLIC_SUPABASE_URL_DEV } from "$env/static/public";
import { dev } from '$app/environment';

export const supabase = dev 
? createClient(
	PUBLIC_SUPABASE_URL_DEV,
	PUBLIC_ANON_KEY_DEV,
) 
: createClient(
	PUBLIC_SUPABASE_URL,
	PUBLIC_ANON_KEY,
)
