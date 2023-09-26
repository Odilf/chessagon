use chessagon::{
    board::{self, standard::Board, BoardTrait},
    piece::{Color, PieceType},
};
use glam::IVec2;
use hext_boards::HexagonalBoard;

pub fn render_board(board: &Board) -> String {
    let hex_board = to_hex(board);

    hex_board.render_with(|piece| match piece {
        Some((piece, color)) => piece.char(color),
        None => ' ',
    })
}

pub fn to_hex(board: &Board) -> HexagonalBoard<Option<(PieceType, Color)>> {
    board::positions()
        .iter()
        .map(|position| {
            (
                IVec2::new(position.x, position.y),
                board
                    .piece_at(*position)
                    .map(|piece| (piece.typ, piece.color)),
            )
        })
        .collect()
}
