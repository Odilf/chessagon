import { Color } from '$engine/chessagon.js';
import { db } from '$lib/db/index.js';
import { games, moves, users } from '$lib/db/schema';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';

export async function load({ parent, params }) {
	const { session } = await parent();

	const game = await db.query.games.findFirst({
		where: eq(games.id, params.gameId),
		with: {
			white: true,
			black: true,
			moves: true,
		}
	})

	if (!game) {
		throw error(404, "Game not found")
	}

	let playerColor;

	if (session.user.id === game.white?.id) {
		playerColor = Color.White;
	} else if (session.user.id === game.black?.id) {
		playerColor = Color.Black;
	}

	if (playerColor == null) {
		let emptySpot: "white" | "black" | null = null;
		if (!game.white) {
			emptySpot = "white";
		} else if (!game.black) {
			emptySpot = "black"
		}

		if (!emptySpot) {
			throw error(403, "Game is full")
		}

		playerColor = emptySpot;
		await db.update(games)
			.set({ [playerColor]: session.user.id })
			.where(eq(games.id, params.gameId))		

		game[playerColor] = session.user;
	}
	
	return {
		game,
		playerColor,
	}
}

export const actions = {
	cancelGame: async ({ params }) => {
		await db.delete(games)
			.where(eq(games.id, params.gameId))

		throw redirect(303, "/play")
	},
}
