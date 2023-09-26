use crate::{
    board::BoardTrait,
    moves::{out_of_reach_helper, IllegalMove, Move},
    vector::Vector,
};

use super::{Color, PieceType};

out_of_reach_helper!(PieceType::Knight);

pub fn try_move(
    mov: &Move,
    color: Color,
    board: &impl BoardTrait,
) -> Result<Option<Vector>, IllegalMove> {
    let (dx, dy) = mov.delta().into();

    // Slightly creeptic, but it works!
    let can_move = matches!(dx * dy, 3  | -2 | 6 if dx != 6 && dy != 6);

    if !can_move {
        return out_of_reach(mov);
    }

    board.check_for_blockers(mov, mov.delta(), color)
}
