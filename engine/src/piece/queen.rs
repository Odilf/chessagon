use crate::{
    board::Board,
    moves::{out_of_reach_helper, IllegalMove, Move},
    vector::Vector,
};

use super::{bishop, rook, Color, PieceType};

out_of_reach_helper!(PieceType::Queen);

pub fn try_move(mov: &Move, color: Color, board: &Board) -> Result<Option<Vector>, IllegalMove> {
    let Some(stride) = rook::get_stride(mov.delta()).or_else(|| bishop::get_stride(mov.delta()))
    else {
        return out_of_reach(mov);
    };

    board.check_for_blockers(mov, stride, color)
}
