use crate::{
    board::BoardTrait,
    moves::{out_of_reach_helper, IllegalMove, Move},
    vector::Vector,
};

use super::{Color, PieceType};

out_of_reach_helper!(PieceType::Rook);

pub fn get_stride(delta: Vector) -> Option<Vector> {
    let output = match delta.into() {
        (0, y) => (0, y.signum()),
        (x, 0) => (x.signum(), 0),
        (x, y) if x == y => (x.signum(), y.signum()),
        _ => return None,
    };

    Some(output.into())
}

pub fn try_move(mov: &Move, color: Color, board: &impl BoardTrait) -> Result<Option<Vector>, IllegalMove> {
    let Some(stride) = get_stride(mov.delta()) else {
        return out_of_reach(mov);
    };

    board.check_for_blockers(mov, stride, color)
}
