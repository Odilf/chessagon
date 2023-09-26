#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

use crate::{
    board::{standard::Board, BoardTraitMut},
    moves::{CheckedMove, IllegalMove, Move},
    piece::{Color, Piece},
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
            _ => unreachable!(),
        }
    }
}

impl GameState {
    pub fn try_move(&mut self, mov: impl Into<Move>) -> Result<Option<Piece>, IllegalMove> {
        let mov = mov.into();
        let captured_piece = self
            .board
            .try_move(mov, self.current_color(), self.moves.last())?;

        self.moves.push(mov);

        Ok(captured_piece)
    }

    pub fn check_move(&mut self, mov: impl Into<Move>) -> Result<CheckedMove, IllegalMove> {
        self.board
            .check_move(mov.into(), self.current_color(), self.moves.last())
    }

    pub fn can_move(&mut self, mov: impl Into<Move>) -> bool {
        self.check_move(mov).is_ok()
    }
}
