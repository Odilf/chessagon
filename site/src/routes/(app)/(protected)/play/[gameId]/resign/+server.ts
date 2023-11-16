import { resign } from "$lib/db/actions/server.js";

export async function POST({ locals, params }) {
  const session = await locals.auth.validate();
  await resign(session.user.id, params.gameId);
  return new Response(null, { status: 200 });
}
