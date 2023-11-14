import { db } from "$lib/db/index.js";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { redirect } from "@sveltejs/kit";
import { joinGame } from "$lib/db/actions/server";
import { and, eq, isNull, not, or } from "drizzle-orm";
import { IN_PROGRESS } from "$lib/game/status.js";
import { games as gamesTable } from "$lib/db/schema";

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
    where: and(
      eq(gamesTable.status_code, IN_PROGRESS),
      or(
        isNull(gamesTable.white), 
        isNull(gamesTable.black),
        eq(gamesTable.white, session.user.id),
        eq(gamesTable.black, session.user.id),
      ),
    ),
    limit: 50,
  });

  const userGame = games.find(
    (game) =>
      game.black?.id === session.user.id || game.white?.id === session.user.id,
  );

  if (userGame) {
    throw redirect(302, `/play/${userGame.id}`);
  }

  return {
    games,
  };
}

const requestSchema = zfd.formData({
  gameId: zfd.text(),
  color: zfd.text(z.enum(["white", "black"])),
});

export const actions = {
  joinGame: async ({ request, locals }) => {
    const session = await locals.auth.validate();
    const { gameId, color } = await requestSchema.parseAsync(
      await request.formData(),
    );

    await joinGame(session.user.id, gameId, color);
  },
};
