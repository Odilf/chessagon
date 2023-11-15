import { checkIfPlayerHasRunOutOfTime } from "$lib/db/actions/server.js";

export async function POST({ params }) {
  await checkIfPlayerHasRunOutOfTime(params.gameId);

  return new Response(null, { status: 200 });
}
