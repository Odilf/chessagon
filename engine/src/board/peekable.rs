use crate::{
    moves::Move,
    piece::{Color, Piece, PieceType},
    vector::Vector,
};

use super::{standard::Board, BoardTrait};

pub struct PeekableBoard<'board> {
    pub(super) original: &'board Board,
    pub(super) captured_piece: Option<Piece>,
    pub(super) mov: Move,
}

impl<'a> BoardTrait for PeekableBoard<'a> {
    fn piece_at(&self, position: Vector) -> Option<&Piece> {
        if position == self.mov.origin {
            None
        } else if position == self.mov.target {
            self.captured_piece.as_ref()
        } else {
            self.original.piece_at(position)
        }
    }
}

impl<'a> PeekableBoard<'a> {
    pub fn capture_target(&self) -> Option<Vector> {
        self.captured_piece.as_ref().map(|piece| piece.position)
    }

    fn pieces(&self) -> impl Iterator<Item = &Piece> {
        self.original
            .pieces
            .iter()
            .filter(move |piece| piece.position != self.mov.origin)
    }

    fn get_king(&self, color: Color) -> &Piece {
        self.pieces()
            .find(|piece| piece.color == color && piece.typ == PieceType::King)
            .unwrap()
    }

    pub fn checking_pieces(
        &self,
        color: Color,
        last_move: Option<Move>,
    ) -> impl Iterator<Item = &Piece> {
        let king = self.get_king(color);

        self.pieces().filter(move |piece| piece.color == color.opposite()).filter(move |piece| {
            let mov = Move::new(piece.position, king.position);

            self.try_move_pre_pins(&mov, color.opposite(), last_move.as_ref())
                .is_ok()
        })
    }
}
