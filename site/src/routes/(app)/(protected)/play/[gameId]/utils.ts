import { GameState } from "$engine/chessagon";
import type { Move } from "$lib/wasmTypesGlue";

export function gameFromMoves(moves: Move[]): GameState {
	const game = new GameState();

	for (const { origin, target } of moves) {
		game.try_move(origin, target);
	}

	return game;
}
