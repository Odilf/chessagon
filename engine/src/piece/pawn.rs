use crate::{
    board::BoardTrait,
    moves::{out_of_reach_helper, IllegalMove, Move},
    vector::Vector,
};

use super::{Color, PieceType};

out_of_reach_helper!(PieceType::Pawn);

pub fn try_move(
    mov: &Move,
    color: Color,
    board: &impl BoardTrait,
    last_move: Option<&Move>,
) -> Result<Option<Vector>, IllegalMove> {
    let max_vertical = if is_starting_position(&mov.origin, color) {
        2
    } else {
        1
    };
    let delta_normalized = mov.delta().normalized(color);

    // Vertical movement
    if let Some(vertical) = delta_normalized.vertical() {
        if vertical <= max_vertical && vertical > 0 {
            return match board.check_for_blockers(mov, Vector::VERTICAL.normalized(color), color) {
                Ok(None) => Ok(None),
                Ok(Some(_)) => Err(IllegalMove::Blocked(
                    board.piece_at(mov.origin).unwrap().clone(), 
                    mov.target, 
                    board.piece_at(mov.target).unwrap().clone(),
                )),
                Err(err) => Err(err),
            }
        } else {
            return out_of_reach(mov);
        }
    }

    // Diagonal captures
    if delta_normalized.symmetric_condition(|v| v == (1, 0)) {
        if let capture_target @ Ok(Some(_)) = board.check_for_blockers(mov, mov.delta(), color) {
            return capture_target;
        }

        // todo!("Handle en passant");

        // // En passant
        // let Some(last_move) = last_move else {
        //     return out_of_reach(mov);
        // };

        // if last_move_enables_en_passant(last_move, board) {
        //     return Ok(Some(mov.target - Vector::VERTICAL.normalized(color)));
        // }
    }

    out_of_reach(mov)
}

pub fn is_starting_position(position: &Vector, color: Color) -> bool {
    position
        .normalized(color)
        .symmetric_condition(|(x, y)| x == -1 && y <= -1)
}

pub fn last_move_enables_en_passant(last_move: &Move, board: &impl BoardTrait) -> bool {
    todo!()
}
