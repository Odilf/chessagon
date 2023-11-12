import { Color } from "$engine/chessagon.js";
import { db } from "$lib/db/index.js";
import { games } from "$lib/db/schema";
import { error, redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function load({ parent, params }) {
  const { session } = await parent();

  const game = await db.query.games.findFirst({
    where: eq(games.id, params.gameId),
    with: {
      white: true,
      black: true,
      moves: true,
    },
  });

  if (!game) {
    throw error(404, "Game not found");
  }

  // Find the player's color
  let playerColor;
  if (session.user.id === game.white?.id) {
    playerColor = Color.White;
  } else if (session.user.id === game.black?.id) {
    playerColor = Color.Black;
  }

  // If the player is not in the game, try to join it
  if (playerColor == null) {
    let emptySpot: "white" | "black" | null = null;
    if (!game.white) {
      emptySpot = "white";
    } else if (!game.black) {
      emptySpot = "black";
    }

    if (!emptySpot) {
      throw error(403, "Game is full");
    }

    playerColor = emptySpot === "white" ? Color.White : Color.Black;
    await db
      .update(games)
      .set({ [emptySpot]: session.user.id })
      .where(eq(games.id, params.gameId));

    game[emptySpot] = session.user;
  }

  return {
    game,
    playerColor,
  };
}

export const actions = {
  cancelGame: async ({ params }) => {
    await db.delete(games).where(eq(games.id, params.gameId));

    throw redirect(303, "/play");
  },
};