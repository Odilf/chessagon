import { Color } from '$engine/chessagon.js';
import { TimeControl } from '$lib/timeControls.js';

export async function load({ data, parent }) {
	const { session } = await parent();
	const { game, white, black } = data;

	return {
		game: {
			isActive: white && black,
			timeControl: new TimeControl(game.tc_minutes, game.tc_increment),
			...game,
		},
		white,
		black,
		playerColor: session.user.id === game.white ? Color.White : Color.Black,
	}
}
