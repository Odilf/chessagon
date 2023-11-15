import { db } from "$lib/db";

export async function load({ parent }) {
  const { session } = await parent();

  const games = await db.query.games.findMany({
    columns: {
      id: true,
      tc_increment: true,
      tc_minutes: true,
    },
    with: {
      black: {
        columns: {
          id: true,
          name: true,
        },
      },
      white: {
        columns: {
          id: true,
          name: true,
        },
      },
      moves: {
        columns: { index: true },
      },
    },
  });
}
