use std::{collections::HashMap, fmt::Display};

use hext_boards::HexagonalBoard;
use nalgebra::{vector, Vector2, Vector, Vector1};

use self::pieces::Piece;

mod pieces;

pub struct Board {
	white: HashMap<Vector2<i32>, Piece>,
	black: HashMap<Vector2<i32>, Piece>,
}

impl Default for Board {
    fn default() -> Self {
		let mut white = HashMap::new();
		let mut black = HashMap::new();

		let positions = [
			((5, 1), Piece::Pawn),
			((4, 1), Piece::Pawn),
			((3, 1), Piece::Pawn),
			((2, 1), Piece::Pawn),
			((1, 1), Piece::Pawn),

			((5, 2), Piece::Rook),
			((5, 3), Piece::Knight),
			((5, 4), Piece::King),

			((5, 5), Piece::Bishop),
			((4, 4), Piece::Bishop),
			((3, 3), Piece::Bishop),
		];

		for ((x, y), piece) in positions {
			black.insert(vector![x, y], piece);
			black.insert(vector![y, x], piece);

			white.insert(vector![-x, -y], piece);
			white.insert(vector![-y, -x], piece);
		}

        Self {
			white,
			black,
		}
    }
}

impl Board {
	fn valid_moves() -> Vec<Vector2<i32>> {
		let mut result = Vec::new();

		for x in -5..=5 {
			for y in -5..=5 {
				if i32::abs(x - y) <= 5 {
					result.push(vector![x, y]);
				}
			}
		}
		
		result
	}
}

impl Display for Board {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
		let mut hex_grid = HashMap::with_capacity(80);

		for position in Board::valid_moves() {
			let char = match (self.white.get(&position), self.black.get(&position)) {
				(None, None) => ' ',
				(Some(piece), _) => piece.white_char(),
				(_, Some(piece)) => piece.black_char(),
			};

			hex_grid.insert(position, char);
		}

        write!(f, "{}", HexagonalBoard { values: hex_grid })
    }
}

#[cfg(test)]
mod tests;