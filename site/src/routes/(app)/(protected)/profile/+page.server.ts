import { db } from "$lib/db/index.js";
import { IN_PROGRESS } from "$lib/game/status.js";

export async function load({ parent }) {
  const { session } = await parent();

  const games = await db.query.games.findMany({
    where: (games, { or, eq, and, ne }) => and(
      or(eq(games.white, session.user.id), eq(games.black, session.user.id)),
      ne(games.status_code, IN_PROGRESS),
    ),
    with: {
      moves: {
        orderBy: (moves, { asc }) => [asc(moves.index)],
      },
    },
    orderBy: (games, { desc }) => [desc(games.created_at)],
    limit: 30,
  });

  return {
    session,
    games,
  };
}
