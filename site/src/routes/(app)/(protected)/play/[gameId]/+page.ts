import { Color } from '$engine/chessagon.js';
import { TimeControl } from '$lib/timeControls.js';

export async function load({ data }) {
	const { game, playerColor } = data;

	return {
		game: {
			isActive: game.white && game.black,
			timeControl: new TimeControl(game.tc_minutes, game.tc_increment),
			...game,
		},
		playerColor,
	}
}
