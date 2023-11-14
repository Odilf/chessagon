import { and, eq, isNull, or } from "drizzle-orm";
import { db } from "..";
import { games, moves } from "../schema";
import { error, redirect } from "@sveltejs/kit";
import type { Color, Move } from "$lib/wasmTypesGlue";
import { createId } from "@paralleldrive/cuid2";
import { pusher } from "$lib/pusher/server";
import {
  gameChannel,
  gameFinishedEvent,
  gameUpdateEvent,
  generalGameChannel,
  newMoveEventName,
} from "$lib/pusher/events";
import { gameFromMoves, moveFromDatabase } from "$lib/wasmTypesGlue";
import { Color as ColorEnum } from "$engine/chessagon";
import {
  getCodeFromStatus,
  getStatusFromCode,
  type Status,
} from "$lib/game/status";
import { TimeControl, calculateTimeRemaining } from "$lib/timeControls";

export async function joinGame(
  userId: string,
  gameId: string,
  color: "white" | "black",
) {
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
      started_at: true,
      tc_minutes: true,
      tc_increment: true,
    },
    where: eq(games.id, gameId),
    with: {
      moves: {
        columns: {
          origin_x: true,
          origin_y: true,
          target_x: true,
          target_y: true,
          timestamp: true,
        },
      },
    },
  });

  if (!game || getStatusFromCode(game.status_code)?.inProgress === false) {
    return new Response("Can't access game", { status: 400 });
  }

  const color: Color = game.moves.length % 2 === 0 ? "white" : "black";

  if (game[color] !== userId) {
    throw error(403, "Not your turn");
  }

  const colorEnum = color === "white" ? ColorEnum.White : ColorEnum.Black;

  // TODO: Check if player run out of time
  const timeRemaining = calculateTimeRemaining(
    game.moves,
    colorEnum,
    game.started_at,
    TimeControl.fromDatabase(game),
  );

  if (timeRemaining < 0) {
    const status = {
      inProgress: false,
      winner: colorEnum,
      reason: "out_of_time",
    } satisfies Status;

    await db
      .update(games)
      .set({ status_code: getCodeFromStatus(status) })
      .where(eq(games.id, gameId));

    pusher.trigger(gameChannel(gameId), gameFinishedEvent, {});

    return;
  }

  const board = gameFromMoves(game.moves.map(moveFromDatabase));

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

export async function checkIfPlayerHasRunOutOfTime(gameId: string) {
  const game = await db.query.games.findFirst({
    columns: {
      white: true,
      black: true,
      status_code: true,
      started_at: true,
      tc_minutes: true,
      tc_increment: true,
    },
    where: eq(games.id, gameId),
    with: {
      moves: {
        columns: {
          timestamp: true,
        },
      },
    },
  });

  if (!game || getStatusFromCode(game.status_code)?.inProgress === false) {
    return new Response("Can't access game", { status: 400 });
  }

  const color = game.moves.length % 2 === 0 ? ColorEnum.White : ColorEnum.Black;

  const timeRemaining = calculateTimeRemaining(
    game.moves,
    color,
    game.started_at,
    TimeControl.fromDatabase(game),
  );

  if (timeRemaining >= 0) {
    return false;
  }

  const status = {
    inProgress: false,
    winner: color,
    reason: "out_of_time",
  } satisfies Status;

  await db
    .update(games)
    .set({ status_code: getCodeFromStatus(status) })
    .where(eq(games.id, gameId));

  pusher.trigger(gameChannel(gameId), gameFinishedEvent, {});

  return true;
}
