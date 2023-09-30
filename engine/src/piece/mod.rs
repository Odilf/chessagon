pub mod bishop;
pub mod king;
pub mod knight;
pub mod pawn;
pub mod queen;
pub mod rook;
mod test;

use crate::vector::Vector;

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[derive(Debug, Clone, Copy, Hash, PartialEq, Eq)]
#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub enum PieceType {
    Pawn,
    Knight,
    Bishop,
    Rook,
    Queen,
    King,
}

impl std::fmt::Display for PieceType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = match self {
            PieceType::Pawn => "pawn",
            PieceType::Knight => "knight",
            PieceType::Bishop => "bishop",
            PieceType::Rook => "rook",
            PieceType::Queen => "queen",
            PieceType::King => "king",
        };

        f.write_str(s)
    }
}

#[derive(Debug, Clone, Copy, Hash, PartialEq, Eq)]
#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub enum Color {
    White,
    Black,
}

impl Color {
    pub const fn value(&self) -> i32 {
        match self {
            Color::White => 1,
            Color::Black => -1,
        }
    }

    pub const fn opposite(&self) -> Color {
        match self {
            Color::White => Color::Black,
            Color::Black => Color::White,
        }
    }
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub fn should_flip(color: Color) -> bool {
    color == Color::Black
}

impl std::fmt::Display for Color {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Color::White => write!(f, "white"),
            Color::Black => write!(f, "black"),
        }
    }
}

#[derive(Debug, Clone, Hash, PartialEq, Eq)]
#[cfg_attr(feature = "wasm", wasm_bindgen(inspectable))]
pub struct Piece {
    pub typ: PieceType,
    pub position: Vector,
    pub color: Color,
}

impl Piece {
    pub fn new(color: Color, typ: PieceType, position: Vector) -> Piece {
        Piece {
            color,
            typ,
            position,
        }
    }

    pub const fn value(&self) -> f32 {
        match self.typ {
            PieceType::Pawn => 1.0,
            PieceType::Knight => 3.0,
            PieceType::Bishop => 3.0,
            PieceType::Rook => 5.0,
            PieceType::Queen => 9.0,
            PieceType::King => f32::INFINITY,
        }
    }

    pub fn move_to(&mut self, target: Vector) {
        self.position = target;
    }

    pub fn move_by(&mut self, delta: Vector) {
        self.position += delta;
    }

    pub fn is_opponent(&self, current_color: Color) -> bool {
        self.color != current_color
    }
}

impl PieceType {
    pub fn char(&self, color: &Color) -> char {
        match color {
            Color::White => match self {
                PieceType::Pawn => '♟',
                PieceType::Knight => '♞',
                PieceType::Bishop => '♝',
                PieceType::Rook => '♜',
                PieceType::Queen => '♛',
                PieceType::King => '♚',
            },

            Color::Black => match self {
                PieceType::Pawn => '♙',
                PieceType::Knight => '♘',
                PieceType::Bishop => '♗',
                PieceType::Rook => '♖',
                PieceType::Queen => '♕',
                PieceType::King => '♔',
            },
        }
    }
}

impl std::fmt::Display for Piece {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{} {} at {}", self.color, self.typ, self.position)
    }
}
