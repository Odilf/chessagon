import { db } from "$lib/db";
import { games } from "$lib/db/schema";
import { createGame, joinGame } from "$lib/db/actions/server.js";
import { generalGameChannel, gameUpdateEvent } from "$lib/pusher/events.js";
import { pusher } from "$lib/pusher/server.js";
import { createId } from "@paralleldrive/cuid2";
import { error, redirect } from "@sveltejs/kit";
import { z } from "zod";

const timeControlSchema = z.object({
  minutes: z.number().int().nonnegative(),
  increment: z.number().int().nonnegative(),
});

const requestSchema = z.object({
  timeControl: timeControlSchema,
  color: z.enum(["white", "black"]).optional(),
});

export async function POST({ request, locals, url }) {
  const session = await locals.auth.validate();
  if (!session) {
    throw error(401, "Not logged in");
  }

  let { timeControl, color } = await requestSchema.parseAsync(
    await request.json(),
  );

  await createGame(session.user.id, timeControl, color);

  return new Response();
}
