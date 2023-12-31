import { and, eq, isNull, or } from "drizzle-orm";
import { db } from "..";
import { drawOffers, games, moves, users } from "../schema";
import { error, redirect } from "@sveltejs/kit";
import type { Color, Move } from "$lib/wasmTypesGlue";
import { createId } from "@paralleldrive/cuid2";
import { pusher } from "$lib/pusher/server";
import {
  drawOfferEvent,
  gameChannel,
  gameFinishedEvent,
  gameStartedEvent,
  gameUpdateEvent,
  generalGameChannel,
  newMoveEventName,
} from "$lib/pusher/events";
import { gameFromMoves, moveFromDatabase } from "$lib/wasmTypesGlue";
import { Color as ColorEnum } from "$engine/chessagon";
import { getCodeFromStatus, type Status } from "$lib/game/status";
import { TimeControl, calculateTimeRemaining } from "$lib/timeControls";
import { updatedRating } from "$lib/game/elo";

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

  pusher.trigger(gameChannel(gameId), gameStartedEvent, {});

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

  if (!game) {
    throw error(400, "Can't access game");
  }

  const color: Color = game.moves.length % 2 === 0 ? "white" : "black";

  if (game[color] !== userId) {
    throw error(403, "Not your turn");
  }

  const colorEnum = color === "white" ? ColorEnum.White : ColorEnum.Black;

  const timeRemaining = calculateTimeRemaining(
    game.moves,
    colorEnum,
    TimeControl.fromDatabase(game),
  );

  if (timeRemaining < 0) {
    await finishGame(gameId, {
      inProgress: false,
      winner: colorEnum,
      reason: "out_of_time",
    });

    return;
  }

  const board = gameFromMoves(game.moves.map(moveFromDatabase));

  const { origin, target } = move;

  if (!board.can_move(origin, target)) {
    throw error(400, "Invalid move");
  }

  await db.insert(moves).values({
    index: game.moves.length,
    gameId: gameId,
    origin_x: origin.x,
    origin_y: origin.y,
    target_x: target.x,
    target_y: target.y,
  });

  pusher.trigger(gameChannel(gameId), newMoveEventName, {
    origin,
    target,
  });
}

export async function finishGame(gameId: string, status: Status) {
  if (status.inProgress) {
    throw error(400, "Game is still in progress");
  }

  const status_code = getCodeFromStatus(status);

  const updateStatusPromise = db
    .update(games)
    .set({ status_code })
    .where(eq(games.id, gameId));

  const updateEloPromise = async () => {
    const elos = await db.query.games.findFirst({
      columns: {
        id: true,
        white: true,
        black: true,
      },
      where: eq(games.id, gameId),
      with: {
        white: {
          columns: {
            id: true,
            rating: true,
          },
        },
        black: {
          columns: {
            id: true,
            rating: true,
          },
        },
      },
    });

    if (!elos) {
      throw error(400, "Can't access game");
    }

    let newRatingWinner: number;
    let newRatingLoser: number;

    if (status.winner === null) {
      newRatingWinner = newRatingLoser = updatedRating(
        { player: elos.white!.rating, opponent: elos.black!.rating },
        0.5,
      );
    } else {
      const winnerKey = status.winner === ColorEnum.White ? "white" : "black";
      const loserKey =
        1 - status.winner === ColorEnum.White ? "white" : "black";

      const ratingWinner = elos[winnerKey]!.rating;
      const ratingLoser = elos[loserKey]!.rating;

      newRatingWinner = updatedRating(
        { player: ratingWinner, opponent: ratingLoser },
        1,
      );
      newRatingLoser = updatedRating(
        { player: ratingLoser, opponent: ratingWinner },
        0,
      );
    }

    await Promise.all([
      db
        .update(users)
        .set({ rating: newRatingWinner })
        .where(eq(users.id, elos.white!.id)),
      db
        .update(users)
        .set({ rating: newRatingLoser })
        .where(eq(users.id, elos.black!.id)),
    ]);
  };

  await Promise.all([updateStatusPromise, updateEloPromise()]);

  pusher.trigger(gameChannel(gameId), gameFinishedEvent, {});
}

export async function checkIfPlayerHasRunOutOfTime(gameId: string) {
  const game = await db.query.games.findFirst({
    columns: {
      white: true,
      black: true,
      status_code: true,
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

  if (!game) {
    throw error(400, "Can't access game");
  }

  const color = game.moves.length % 2 === 0 ? ColorEnum.White : ColorEnum.Black;

  const timeRemaining = calculateTimeRemaining(
    game.moves,
    color,
    TimeControl.fromDatabase(game),
  );

  if (timeRemaining >= 0) {
    return false;
  }

  await finishGame(gameId, {
    inProgress: false,
    winner: 1 - color,
    reason: "out_of_time",
  });

  return true;
}

export async function offerDraw(userId: string, gameId: string) {
  const game = await db.query.games.findFirst({
    columns: {
      white: true,
      black: true,
    },
    where: and(
      eq(games.id, gameId),
      or(eq(games.white, userId), eq(games.black, userId)),
    ),
  });

  if (!game) {
    throw error(400, "Can't access game");
  }

  const color = game.white === userId ? ColorEnum.White : ColorEnum.Black;

  await db.insert(drawOffers).values({
    gameId,
    from: color,
  });

  pusher.trigger(gameChannel(gameId), drawOfferEvent(color), {});
}

export async function retractDrawOffer(userId: string, gameId: string) {
  const game = await db.query.games.findFirst({
    columns: {
      white: true,
      black: true,
    },
    where: and(
      eq(games.id, gameId),
      or(eq(games.white, userId), eq(games.black, userId)),
    ),
  });

  if (!game) {
    throw error(400, "Can't access game");
  }

  const color = game.white === userId ? ColorEnum.White : ColorEnum.Black;

  await db
    .delete(drawOffers)
    .where(and(eq(drawOffers.gameId, gameId), eq(drawOffers.from, color)));

  pusher.trigger(gameChannel(gameId), drawOfferEvent(color), {});
}

export async function acceptDraw(userId: string, gameId: string) {
  const drawOffer = await db.query.drawOffers.findFirst({
    where: and(eq(drawOffers.gameId, gameId)),
  });

  if (!drawOffer) {
    throw error(400, "Draw has not been offered");
  }

  const acceptantColor =
    1 - drawOffer.from === ColorEnum.White
      ? ("white" as const)
      : ("black" as const);

  const result = await db.query.games.findFirst({
    columns: { [acceptantColor]: true },
    where: and(eq(games.id, gameId), eq(games[acceptantColor], userId)),
  });

  if (!result) {
    throw error(400, "Can't find game");
  }

  await finishGame(gameId, {
    inProgress: false,
    winner: null,
    reason: "agreement",
  });
}

export async function resign(userId: string, gameId: string) {
  const game = await db.query.games.findFirst({
    columns: {
      white: true,
      black: true,
    },
    where: and(
      eq(games.id, gameId),
      or(eq(games.white, userId), eq(games.black, userId)),
    ),
  });

  if (!game) {
    throw error(400, "Can't access game");
  }

  const color = game.white === userId ? ColorEnum.White : ColorEnum.Black;

  await finishGame(gameId, {
    inProgress: false,
    winner: 1 - color,
    reason: "resignation",
  });
}
