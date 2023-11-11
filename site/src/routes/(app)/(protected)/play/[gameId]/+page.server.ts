import { Color } from '$engine/chessagon.js';
import { db } from '$lib/db/index.js';
import { games, users } from '$lib/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

export async function load({ parent, params }) {
	const { session } = await parent();

	const white = alias(users, "white")
	const black = alias(users, "black")

	const [result] = await db.select().from(games)
		.where(eq(games.id, params.gameId))
		.leftJoin(white, eq(white.id, games.white))
		.leftJoin(black, eq(black.id, games.black))
		// .innerJoin(moves)

	if (!result?.games) {
		throw error(404, "Game not found")
	}

	if (result.games.white && result.games.black) {
		throw error(403, "Game already started")
	}

	let playerColor;

	if (session.user.id === result.white) {
		playerColor = Color.White;
	} else if (session.user.id === result.black) {
		playerColor = Color.Black;
	}

	if (!playerColor) {
		playerColor = result.games.white ? "black" : "white" as "black" | "white";
		db.update(games)
			.set({ [playerColor]: session.user.id })
			.where(eq(games.id, params.gameId))

		result[playerColor] = session.user;
	}
		
	return {
		game: result.games,
		white: result.white,
		black: result.black,
	}
}
