import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { supabase, session } = await parent();

	console.log("Redirecting", session);
	if (session) {
		
		throw redirect(303, '/profile')
	}
}
