use chessagon::{game::GameState, moves::Move, vector::Vector};

fn main() {
    let mut game = GameState::new();

	// Move the central pawn forward one space
    game.try_move(Move::new(Vector::new(-1, -1), Vector::new(0, 0)))
        .unwrap();

	// An invalid move fails and tells you why
	let err = game.try_move(Move::new(Vector::new(-1, -1), Vector::new(0, 0)))
        .unwrap_err();

	println!("{}", err);
	// Prints `attempt to move from (-1, -1), but there isn't a piece there``
}
