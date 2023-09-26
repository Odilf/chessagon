use crate::{
    moves::{IllegalMove, Move},
    piece::{Color, Piece},
    vector::Vector,
};

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

use super::{BoardTrait, peekable::PeekableBoard, BoardTraitMut};

#[derive(Debug, Clone)]
#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub struct Board {
    pub(in super) pieces: Vec<Piece>,
}

impl Default for Board {
    fn default() -> Self {
        Board {
            pieces: super::generate_board_pieces(),
        }
    }
}

impl BoardTrait for Board {
    fn piece_at(&self, position: Vector) -> Option<&Piece> {
        self.pieces.iter().find(|piece| piece.position == position)
    }
}

impl BoardTraitMut for Board {
    fn piece_at_mut(&mut self, position: Vector) -> Option<&mut Piece> {
        self.pieces.iter_mut().find(|piece| piece.position == position)
    }

	fn capture(&mut self, at: &Vector) -> Option<Piece> {
        self.pieces
            .iter()
            .position(|piece| piece.position == *at)
            .map(|index| self.pieces.swap_remove(index))
    }

	fn peek(&mut self, mov: &Move, player_color: Color, last_move: Option<&Move>) -> Result<PeekableBoard, IllegalMove> {
        let capture_target = self.try_move_pre_pins(mov, player_color, last_move)?;
		let captured_piece = capture_target.and_then(|target| self.piece_at(target)).cloned();

		Ok(PeekableBoard {
			original: self,
			captured_piece,
			mov: *mov,
		})
    }
}



    
//     /// Returns all the pieces that are checking the player with the given color
//     pub fn checking_pieces<'a>(&'a self, color: Color, last_move: Option<&'a Move>) -> impl Iterator<Item = &'a Piece> {
//         let king = self.get_king(color);

//         self.pieces_of(color.opposite()).filter(move |piece| {
//             let mov = Move::new(piece.position, king.position);

//             self.try_move_pre_pins(&mov, color.opposite(), last_move).is_ok()
//         })
//     }
