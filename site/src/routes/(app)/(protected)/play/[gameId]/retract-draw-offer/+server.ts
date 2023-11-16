import { retractDrawOffer } from "$lib/db/actions/server.js";

export async function POST({ locals, params, request }) {
  const session = await locals.auth.validate();

  await retractDrawOffer(session.user.id, params.gameId);

  return new Response(null, { status: 200 });
}
