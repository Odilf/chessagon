import { db } from "$lib/db";
import { games } from "$lib/db/schema";
import { getStatusFromCode } from "$lib/game/status";
import { error } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function load({ parent, params }) {
	const { session } = await parent();

	const game = await db.query.games.findFirst({
		columns: {
			id: true,
			tc_increment: true,
			tc_minutes: true,
			status_code: true,
			started_at: true,
		},
		where: eq(games.id, params.gameId),
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

	if (!game || getStatusFromCode(game.status_code)?.inProgress) {
		throw error(404, "Game not found");
	}

	return {
		game
	}
}
