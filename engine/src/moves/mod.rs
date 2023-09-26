pub mod parse;

use thiserror::Error;

use derive_more::{From, Into};

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

use crate::{
    piece::{Color, Piece, PieceType},
    vector::Vector,
};

#[cfg_attr(feature = "wasm", wasm_bindgen)]
#[derive(Debug, Clone, Copy, From, Into)]
pub struct Move {
    pub origin: Vector,
    pub target: Vector,
}

/// A move that is checked to be legal.
pub struct CheckedMove {
    pub mov: Move,
    pub capture_target: Option<Vector>,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl Move {
    #[wasm_bindgen(constructor)]
    pub fn new_wasm(origin: &Vector, target: &Vector) -> Self {
        Self::new(*origin, *target)
    }
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl Move {
    pub fn delta(&self) -> Vector {
        self.target - self.origin
    }
}

impl Move {
    pub fn new(origin: Vector, target: Vector) -> Self {
        Self { origin, target }
    }
}

#[derive(Debug, Error)]
pub enum IllegalMove {
    #[error("attempt to move {0} piece when it's {}'s turn", .0.opposite())]
    InvalidColor(Color),

    // TODO: Clarify this error message if origin and target are the same
    #[error("a {0} cannot move to {} from {}", .1.origin, .1.target)]
    OutOfReach(PieceType, Move),

    #[error("attempt to move from {0}, but there isn't a piece there")]
    NotAPieceThere(Vector),

    // TODO: I think this error message will look ugly
    #[error("{0} is pinned by {}", .1.iter().map(|p| p.to_string()).collect::<Vec<_>>().join(", "))]
    Pin(Piece, Vec<Piece>),

    #[error("{0} is blocked from moving to {1} by {2}")]
    Blocked(Piece, Vector, Piece),
}

macro_rules! out_of_reach_helper {
    ($piece_type:expr) => {
        fn out_of_reach<T>(mov: &Move) -> Result<T, IllegalMove> {
            Err(IllegalMove::OutOfReach($piece_type, mov.clone()))
        }
    };
}

pub(crate) use out_of_reach_helper;
