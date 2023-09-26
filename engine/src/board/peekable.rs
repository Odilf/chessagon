use crate::{
    moves::Move,
    piece::{Color, Piece, PieceType},
    vector::Vector,
};

use super::{standard::Board, BoardTrait};

// NOTE: Technically it would be more idomatic for this to be generic over `BoardTrait` and then delegate to `BoardTrait::piece_at`,
// while doing the correct modifications. In practice, this is unecessary and I only have one implementor. In fact using a trait is
// kinda useless by itself.
#[derive(Debug, Clone)]
pub struct PeekableBoard<'board> {
    pub(super) original: &'board Board,
    pub(super) capture_target: Option<Vector>,
    pub(super) moved_piece: Piece,
    pub(super) mov: Move,
}

impl<'a> PeekableBoard<'a> {
    pub fn new(original: &'a Board, mov: Move, capture_target: Option<Vector>) -> Self {
        let mut moved_piece = original.piece_at(mov.origin).unwrap().clone();
        moved_piece.move_to(mov.target);

        PeekableBoard {
            original,
            capture_target,
            moved_piece,
            mov,
        }
    }
}

impl<'a> BoardTrait for PeekableBoard<'a> {
    fn piece_at(&self, position: Vector) -> Option<&Piece> {
        // `mov.origin` is always empty and `mov.target` has always the piece that was previously at `mov.origin`
        if position == self.mov.origin {
            return None;
        } else if position == self.mov.target {
            return Some(&self.moved_piece);
        }

        // if there was a piece captured at some other place, it's not there anymore
        if Some(position) == self.capture_target {
            return None;
        }

        // everything else is the same
        self.original.piece_at(position)
    }
}

impl<'a> PeekableBoard<'a> {
    fn pieces(&self) -> impl Iterator<Item = &Piece> {
        self.original
            .pieces
            .iter()
            // Remove all pieces that are in the move (and the captured one)
            .filter(move |piece| {
                !(piece.position == self.mov.origin
                    || piece.position == self.mov.target
                    || Some(piece.position) == self.capture_target)
            })
            // Add back in piece in `mov.target`
            .chain(std::iter::once(
                &self.moved_piece
            ))
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

        super::checking_pieces(self, color, last_move, king, self.pieces())
    }
}
