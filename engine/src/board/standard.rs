use crate::{
    moves::{IllegalMove, Move},
    piece::{Color, Piece, PieceType},
    vector::Vector, game::status::{Status, DrawReason},
};

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

use super::{peekable::PeekableBoard, BoardTrait, BoardTraitMut};

#[derive(Debug, Clone)]
#[cfg_attr(feature = "wasm", wasm_bindgen(inspectable))]
pub struct Board {
    pub(super) pieces: Vec<Piece>,
}

impl Default for Board {
    fn default() -> Self {
        Board {
            pieces: super::generate_board_pieces(),
        }
    }
}

impl Board {
    pub fn pieces_of(&self, color: Color) -> impl Iterator<Item = &Piece> {
        self.pieces.iter().filter(move |piece| piece.color == color)
    }

    fn legal_moves<'a>(&'a self, color: Color, last_move: Option<&'a Move>) -> impl Iterator<Item = Move> + 'a {
        self.pieces_of(color)
            .flat_map(move |piece| super::position_iter().filter_map(move |position| {
                let mov = Move::new(piece.position, position);

                if self.check_move(mov, color, last_move).is_ok() {
                    Some(mov)
                } else {
                    None
                }
            }))
    }

    pub fn get_king(&self, color: Color) -> &Piece {
        self.pieces
            .iter()
            .find(|piece| piece.color == color && piece.typ == PieceType::King)
            .unwrap()
    }

    pub fn checking_pieces(
        &self,
        color: Color,
        last_move: Option<Move>,
    ) -> impl Iterator<Item = &Piece> {
        let king = self.get_king(color);

        super::checking_pieces(self, color, last_move, king, self.pieces.iter())
    }

    pub fn status(&self, color: Color, last_move: Option<Move>) -> Status {
        // TODO: Implement the rest of the drawing methods.

        if self.legal_moves(color, last_move.as_ref()).next().is_none() {
            if self.checking_pieces(color, last_move).next().is_none() {
                Status::Draw(DrawReason::Stalemate)
            } else {
                Status::Checkmate
            }
        } else {
            Status::InProgress
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
        self.pieces
            .iter_mut()
            .find(|piece| piece.position == position)
    }

    fn capture(&mut self, at: &Vector) -> Option<Piece> {
        self.pieces
            .iter()
            .position(|piece| piece.position == *at)
            .map(|index| self.pieces.swap_remove(index))
    }

    fn peek(
        &self,
        mov: &Move,
        player_color: Color,
        last_move: Option<&Move>,
    ) -> Result<PeekableBoard, IllegalMove> {
        let capture_target = self.try_move_pre_pins(mov, player_color, last_move)?;

        Ok(PeekableBoard::new(self, *mov, capture_target))
    }
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl Board {
    #[wasm_bindgen(js_name = "piece_at")]
    pub fn piece_at_wasm(&self, position: &Vector) -> Option<Piece> {
        self.piece_at(*position).cloned()
    }

    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self::default()
    }
}
