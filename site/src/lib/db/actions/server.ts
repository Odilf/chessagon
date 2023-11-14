import { and, eq, isNull, or } from "drizzle-orm";
import { db } from "..";
import { games, moves } from "../schema";
import { error, redirect } from "@sveltejs/kit";
import type { Color, Move } from "$lib/wasmTypesGlue";
import { createId } from "@paralleldrive/cuid2";
import { pusher } from "$lib/pusher/server";
import {
  gameChannel,
  gameUpdateEvent,
  generalGameChannel,
  newMoveEventName,
} from "$lib/pusher/events";
import { gameFromMoves } from "$lib/wasmTypesGlue";
import { Vector } from "$engine/chessagon";

export async function joinGame(userId: string, gameId: string, color: "white" | "black") {
  const result = await db
    .update(games)
    .set({
      [color]: userId,
    })
    .where(and(eq(games.id, gameId), isNull(games[color])));

  if (result.rowsAffected === 0) {
    throw error(403, "Game is full");
  }

  pusher.trigger(generalGameChannel, gameUpdateEvent, {});

  throw redirect(302, `/play/${gameId}`);
}

export async function createGame(
  userId: string,
  timeControl: { minutes: number; increment: number },
  color: Color | undefined,
) {
  color ??= Math.random() > 0.5 ? "white" : "black";

  const gameId = createId();
  await db.insert(games).values({
    id: gameId,
    tc_increment: timeControl.increment,
    tc_minutes: timeControl.minutes,
    [color]: userId,
  });

  pusher.trigger(generalGameChannel, gameUpdateEvent, {});
}

export async function cancelGame(userId: string, gameId: string) {
  await db.delete(games).where(
    and(
      eq(games.id, gameId),
      or(eq(games.white, userId), eq(games.black, userId)),
      or(isNull(games.white), isNull(games.black)), // Only cancel games that haven't started
    ),
  );

  pusher.trigger(generalGameChannel, gameUpdateEvent, {});

  throw redirect(303, "/play");
}

export async function receiveMove(userId: string, gameId: string, move: Move) {
  const game = await db.query.games.findFirst({
    columns: {
      white: true,
      black: true,
      status_code: true,
    },
    where: eq(games.id, gameId),
    with: {
      white: {
        columns: {
          id: true,
        },
      },
      black: {
        columns: {
          id: true,
        },
      },
      moves: {
        columns: {
          origin_x: true,
          origin_y: true,
          target_x: true,
          target_y: true,
        },
      },
    },
  });

  if (!game) {
    return new Response("Can't access game", { status: 400 });
  }

  const color =
    game.moves.length % 2 === 0 ? "white" : ("black" as "white" | "black");

  if (game[color]?.id !== userId) {
    throw error(403, "Not your turn");
  }

  const board = gameFromMoves(
    game.moves.map(({ origin_x, origin_y, target_x, target_y }) => ({
      origin: new Vector(origin_x, origin_y),
      target: new Vector(target_x, target_y),
    })),
  );

  const { origin, target } = move;

  if (!board.can_move(origin, target)) {
    throw error(400, "Invalid move");
  }

  const insertMovePromise = db.insert(moves).values({
    index: game.moves.length,
    gameId: gameId,
    origin_x: origin.x,
    origin_y: origin.y,
    target_x: target.x,
    target_y: target.y,
  });

  const promises = [insertMovePromise];

  if (game.moves.length === 0) {
    const updateGameTimePromise = db
      .update(games)
      .set({ started_at: new Date() })
      .where(eq(games.id, gameId));

    // TODO: Why doesn't this work 😭😭😭
    // promises.push(updateGameTimePromise);
    await updateGameTimePromise;
  }

  await Promise.all(promises);

  pusher.trigger(gameChannel(gameId), newMoveEventName, {
    origin,
    target,
  });
}
