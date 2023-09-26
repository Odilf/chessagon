use crate::{
    board::Board,
    moves::{out_of_reach_helper, IllegalMove, Move},
    vector::Vector,
};

use super::{Color, PieceType};

out_of_reach_helper!(PieceType::King);

pub fn try_move(mov: &Move, color: Color, board: &Board) -> Result<Option<Vector>, IllegalMove> {
    // This is kind of cryptic but it actually works. There's probably a more idiomatic way to do
    // this, by having notions of how much you've moved in rook and bishop strides and assert that
    // you've moved exactly one of them, but I doubt it would be more efficient and it's not clear
    // how to implement it.
    let can_move = mov
        .delta()
        .symmetric_condition(|(x, y)| x.abs() == 1 && (-1..=2).contains(&(y * x.signum())));

    if !can_move {
        return out_of_reach(mov);
    }

    board.check_for_blockers(mov, mov.delta(), color)
}
