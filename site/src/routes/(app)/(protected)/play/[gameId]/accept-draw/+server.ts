import { Color } from '$engine/chessagon';
import { acceptDraw } from '$lib/db/actions/server.js';
import { z } from 'zod';

export async function POST({ locals, params, request }) {
	const session = await locals.auth.validate();
	
	await acceptDraw(session.user.id, params.gameId);

	return new Response(null, { status: 200 });
}
