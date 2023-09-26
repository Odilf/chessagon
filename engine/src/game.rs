#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

use crate::{
    board::Board,
    moves::{IllegalMove, Move},
    piece::{bishop, king, knight, pawn, queen, rook, Color, Piece, PieceType},
    vector::Vector,
};

#[cfg_attr(feature = "wasm", wasm_bindgen(getter_with_clone))]
#[derive(Debug, Clone, Default)]
pub struct GameState {
    pub board: Board,
    moves: Vec<Move>,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl GameState {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self::default()
    }

    #[wasm_bindgen(js_name = "can_move")]
    pub fn can_move_wasm(&mut self, origin: &Vector, target: &Vector) -> bool {
        self.can_move((*origin, *target))
    }

    #[wasm_bindgen(js_name = "try_move")]
    pub fn try_move_wasm(
        &mut self,
        origin: &Vector,
        target: &Vector,
    ) -> Result<Option<Piece>, JsError> {
        self.try_move((*origin, *target))
            .map_err(|err| JsError::new(&err.to_string()))
    }
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl GameState {
    pub fn turn(&self) -> i32 {
        self.moves.len() as i32 / 2
    }

    pub fn current_color(&self) -> Color {
        match self.moves.len() % 2 {
            0 => Color::White,
            1 => Color::Black,
            _ => unreachable!("reeally?"),
        }
    }
}

impl GameState {
    pub fn try_move(&mut self, mov: impl Into<Move>) -> Result<Option<Piece>, IllegalMove> {
        self.try_move_maybe_dry(mov, false)
    }

    pub fn can_move(&mut self, mov: impl Into<Move>) -> bool {
        self.try_move_maybe_dry(mov, true).is_ok()
    }

    pub fn try_move_maybe_dry(
        &mut self,
        mov: impl Into<Move>,
        dry: bool,
    ) -> Result<Option<Piece>, IllegalMove> {
        let mov = mov.into();

        let capture_target = self.try_move_pre_pins(&mov)?;

        let captured_piece = self.execute_unchecked(&mov, capture_target);

        {
            let mut checking_pieces = self
                .checking_pieces(self.current_color().opposite())
                .peekable();

            if checking_pieces.peek().is_some() {
                let err = Err(IllegalMove::Pin(
                    self.board.piece_at(&mov.target).unwrap().clone(),
                    checking_pieces.cloned().collect(),
                ));

                self.undo_execution_unchecked(&mov, captured_piece);

                return err;
            };
        }

        if dry {
            self.undo_execution_unchecked(&mov, captured_piece.clone());
        }

        Ok(captured_piece)
    }

    fn try_move_pre_pins(&self, mov: &Move) -> Result<Option<Vector>, IllegalMove> {
        let Some(piece) = self.board.piece_at(&mov.origin) else {
            return Err(IllegalMove::NotAPieceThere(mov.origin));
        };

        let piece_type = piece.typ;
        let color = piece.color;

        if color != self.current_color() {
            return Err(IllegalMove::InvalidColor(color));
        }

        match piece_type {
            PieceType::Pawn => pawn::try_move(mov, color, &self.board, self.moves.last()),
            PieceType::Knight => knight::try_move(mov, color, &self.board),
            PieceType::Rook => rook::try_move(mov, color, &self.board),
            PieceType::Bishop => bishop::try_move(mov, color, &self.board),
            PieceType::Queen => queen::try_move(mov, color, &self.board),
            PieceType::King => king::try_move(mov, color, &self.board),
        }
    }

    /// Executes a move assuming it is valid. Might break invariants. Panics if there isn't a piece in `mov.origin`.
    fn execute_unchecked(&mut self, mov: &Move, capture_target: Option<Vector>) -> Option<Piece> {
        let captured_piece = capture_target.and_then(|target| self.board.capture(&target));

        let piece = self
            .board
            .piece_at_mut(&mov.origin)
            .expect("There should be a piece in `mov.origin`");

        piece.move_to(mov.target);

        self.moves.push(mov.clone());

        captured_piece
    }

    /// Undoes execution of a move (assuming the move is valid and has been made).
    /// Might break invariants. Panics if there isn't a piece in `mov.origin`.
    fn undo_execution_unchecked(&mut self, mov: &Move, captured_piece: Option<Piece>) {
        let piece = self
            .board
            .piece_at_mut(&mov.target)
            .expect("There should be a piece in `mov.target`");

        piece.move_to(mov.origin);

        if let Some(captured_piece) = captured_piece {
            self.board.place(captured_piece);
        }

        self.moves.pop();
    }

    /// Returns all the pieces that are checking the player with the given color
    pub fn checking_pieces(&self, color: Color) -> impl Iterator<Item = &Piece> {
        let king = self.board.get_king(color);

        self.board.pieces_of(color.opposite()).filter(|piece| {
            let mov = Move::new(piece.position, king.position);

            self.try_move_pre_pins(&mov).is_ok()
        })
    }
}
