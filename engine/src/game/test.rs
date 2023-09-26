#![cfg(test)]

use crate::{game::status::Status, moves::parse};

use super::GameState;

// TODO: Write tests for checkmate and stalemate

#[test]
fn status() {
	let game = GameState::new();

	assert_eq!(game.status(), Status::InProgress);
}

#[test]
fn checkmate() {
	let moves = "
		-5,-4 to -4,-2
		5,1 by -1,-1

		-4,-2 to -3,0
		4,0 by -1,-1

		-3,0 to -1,1
		5,4 to 3,0

		-1,-5 by 1,1
		1,2 to 0,1
	";

	let mut game = GameState::new();

	for line in moves.trim().lines().filter(|line| !line.is_empty()) {
		let mov = parse::algebraic(line).unwrap();
		game.try_move(mov).unwrap();
	}
	assert_eq!(game.status(), Status::Checkmate);
}
