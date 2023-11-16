import { Color } from '$engine/chessagon';
import { offerDraw } from '$lib/db/actions/server.js';
import { z } from 'zod';

const requestSchema = z.object({
	color: z.nativeEnum(Color),
});

export async function POST({ locals, params, request }) {
	const session = await locals.auth.validate();
	const { color } = requestSchema.parse(await request.json());
	
	offerDraw(session.user.id, params.gameId, color);

	return new Response(null, { status: 200 });
}
