#[derive(Debug, Clone, Copy)]
pub enum Piece {
	Pawn,
	Knight,
	Bishop,
    Rook,
	Queen,
	King,
}

impl Piece {

	/// Returns the value of the piece
	pub const fn value(&self) -> i32 {
		use Piece::*;

		match self {
			Pawn => 1,
			Knight => 3,
			Bishop => 3,
			Rook => 5,
			Queen => 9,
			King => i32::MAX,
		}
	}

	pub fn white_char(&self) -> char {
		char::from(*self)
	}

	pub fn black_char(&self) -> char {
		use Piece::*;

		match self {
			Pawn => 'Ԁ',
			Knight => 'ᴺ',
			Bishop => 'ꓭ',
			Rook => 'ꓤ',
			Queen => 'Ꝺ',
			King => 'ꓘ',
		}
	}
}

impl From<Piece> for char {
    fn from(piece: Piece) -> Self {
        use Piece::*;

		match piece {
			Pawn	=> 'P',
			Knight	=> 'N',
			Bishop	=> 'B',
			Rook	=> 'R',
			Queen	=> 'Q',
			King	=> 'K',
		}
    }
}
