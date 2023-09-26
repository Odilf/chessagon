use crate::{
    moves::{IllegalMove, Move},
    piece::{Color, Piece, PieceType},
    vector::Vector,
};

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

use once_cell::sync::Lazy;

#[derive(Debug, Clone)]
#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub struct Board {
    pieces: Vec<Piece>,
}

impl Default for Board {
    fn default() -> Self {
        Board {
            pieces: Self::generate_board_pieces(),
        }
    }
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl Board {
    #[cfg_attr(feature = "wasm", wasm_bindgen(constructor))]
    pub fn new() -> Self {
        Self::default()
    }

    #[cfg_attr(feature = "wasm", wasm_bindgen(js_name = "piece_at"))]
    pub fn piece_at_wasm(&self, target: &Vector) -> Option<Piece> {
        self.piece_at(target).cloned()
    }
}

impl Board {
    pub const SIZE: i32 = 5;

    pub fn piece_at(&self, target: &Vector) -> Option<&Piece> {
        self.pieces.iter().find(|piece| piece.position == *target)
    }

    pub fn piece_at_mut(&mut self, target: &Vector) -> Option<&mut Piece> {
        self.pieces.iter_mut().find_map(|piece| {
            if piece.position == *target {
                Some(piece)
            } else {
                None
            }
        })
    }

    pub fn get_king(&self, color: Color) -> &Piece {
        self.pieces
            .iter()
            .find(|piece| piece.typ == PieceType::King && piece.color == color)
            .expect("Each color should have exactly one king")
    }

    // TODO: Make const
    pub fn positions() -> Lazy<Vec<Vector>> {
        Lazy::new(|| {
            let mut output = Vec::with_capacity(Self::SIZE.pow(2) as usize);

            for x in -Self::SIZE..=Self::SIZE {
                for y in -Self::SIZE..=Self::SIZE {
                    if x.abs_diff(y) as i32 <= Self::SIZE {
                        output.push(Vector::new(x, y));
                    }
                }
            }

            output
        })
    }

    fn generate_board_pieces() -> Vec<Piece> {
        let mut pieces = Vec::with_capacity(36);

        let mut insert = |x, y, color, piece_type| {
            let item = Piece::new(color, piece_type, Vector::new(x, y));
            pieces.push(item);
        };

        use Color::*;
        use PieceType::*;

        // Pawns
        insert(-1, -1, White, Pawn);
        insert(1, 1, Black, Pawn);

        for i in 2..=5 {
            insert(-i, -1, White, Pawn);
            insert(-1, -i, White, Pawn);
            insert(i, 1, Black, Pawn);
            insert(1, i, Black, Pawn);
        }

        // Rooks, knights, bishops for both colors
        for (i, color) in [(-1, White), (1, Black)] {
            insert(5 * i, 2 * i, color, Rook);
            insert(2 * i, 5 * i, color, Rook);

            insert(5 * i, 3 * i, color, Knight);
            insert(3 * i, 5 * i, color, Knight);

            insert(5 * i, 5 * i, color, Bishop);
            insert(4 * i, 4 * i, color, Bishop);
            insert(3 * i, 3 * i, color, Bishop);
        }

        // Queens and kings
        insert(-5, -4, White, King);
        insert(-4, -5, White, Queen);

        insert(5, 4, Black, Queen);
        insert(4, 5, Black, King);

        pieces
    }

    pub fn pieces(&self) -> &[Piece] {
        &self.pieces
    }

    pub fn pieces_of(&self, color: Color) -> impl Iterator<Item = &Piece> {
        self.pieces.iter().filter(move |piece| piece.color == color)
    }

    pub fn capture(&mut self, at: &Vector) -> Option<Piece> {
        self.pieces
            .iter()
            .position(|piece| piece.position == *at)
            .map(|index| self.pieces.swap_remove(index))
    }

    pub fn place(&mut self, piece: Piece) -> Option<()> {
        if self.piece_at(&piece.position).is_some() {
            return None;
        }

        self.pieces.push(piece);
        Some(())
    }

    pub fn place_unchecked(&mut self, piece: Piece) {
        self.pieces.push(piece);
    }

    /// Checks if there are any blockers in the path of a move.
    /// If there is a piece in it's path it returns an `Err(IllegalMove::Blocked(...))`.
    ///
    /// If the last piece is of the opposite color, it returns it's position. Otherwise it returns `Ok(None)`.
    ///
    /// If the stride is not a multiple of the move's
    /// delta, this function will loop infinitely (though it will panic in debug mode).
    ///
    /// This function assumes that there is a piece at the origin. (TODO: reconsider this)
    ///
    /// # Panics
    /// This function will panic if the stride is not a multiple of the move's delta.
    ///
    /// It also panics if it finds a blocker and there is no piece at the origin.
    pub fn check_for_blockers(
        &self,
        mov: &Move,
        stride: Vector,
        color: Color,
    ) -> Result<Option<Vector>, IllegalMove> {
        // if cfg!(debug_assertions) {
            assert!(
                mov.delta().multiplicity_of(&stride).is_some(),
                "Stride must be a multiple of the move's delta (stride: {}, delta: {})",
                stride,
                mov.delta()
            );
        // }

        let blocked = |blocker: &Piece| {
            Err(IllegalMove::Blocked(
                self.piece_at(&mov.origin)
                    .expect("There should be a piece at the origin")
                    .clone(),
                mov.target,
                blocker.clone(),
            ))
        };

        let mut current = mov.origin + stride;
        while current != mov.target {
            if let Some(blocker) = self.piece_at(&current) {
                return blocked(blocker);
            }

            current += stride;

            if current.x > 100 {
                log(&format!("yikes. current: {}, stride: {}, mov: {:?}", current, stride, mov));
                panic!("yikes. current: {}, stride: {}, mov: {:?}", current, stride, mov);
            }
        }

        if let Some(piece_at_target) = self.piece_at(&current) {
            return if piece_at_target.is_opponent(color) {
                Ok(Some(current))
            } else {
                blocked(piece_at_target)
            };
        }

        Ok(None)
    }
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
