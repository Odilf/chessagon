use std::f32::consts::PI;

use derive_more::{Add, AddAssign, From, Into, Mul, MulAssign, Sub, SubAssign};

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

use crate::piece::Color;

/// A 2D vector with integer coordinates in hexagonal basis.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Add, AddAssign, Sub, Mul, From, Into)]
#[cfg_attr(feature = "wasm", wasm_bindgen(inspectable))]
pub struct Vector {
    pub x: i32,
    pub y: i32,
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
impl Vector {
    #[cfg_attr(feature = "wasm", wasm_bindgen(constructor))]
    pub fn new(x: i32, y: i32) -> Self {
        Self { x, y }
    }

    pub fn to_canonic(&self, alignment: Alignment) -> CanonicalVector {
        let [b1, b2] = alignment.basis();
        b1 * self.x as f32 + b2 * self.y as f32
    }

    pub fn normalized(&self, color: Color) -> Self {
        *self * color.value()
    }

    /// Returns the vertical component of the vector if it is vertical, otherwise returns `None`.
    ///
    /// In hexagonal coords, a vector is vertical if its x and y components are equal.
    pub fn vertical(&self) -> Option<i32> {
        match self {
            Vector { x, y } if x == y => Some(*x),
            _ => None,
        }
    }

    pub fn multiplicity_of(&self, factor: &Vector) -> Option<i32> {
        // First option is whether it is divisible, second option is whether we know it.
        // So, `Some(None)` means that it is divisible, but we don't know the result.
        let get_factor = |this, factor| {
            if factor == 0 {
                if this == 0 {
                    Some(None)
                } else {
                    None
                }
            } else if this % factor == 0 {
                Some(Some(this / factor))
            } else {
                None
            }
        };

        let x = get_factor(self.x, factor.x)?;
        let y = get_factor(self.y, factor.y)?;

        match (x, y) {
            (None, None) => Some(1), // This occurs when `self == factor == 0`, so we default to 1 even though technically any number is correct.
            (Some(f), None) | (None, Some(f)) => Some(f),
            (Some(x), Some(y)) if x == y => Some(x),
            _ => None,
        }
    }
}

impl Vector {
    pub fn map(self, f: impl Fn(i32) -> i32) -> Self {
        Self {
            x: f(self.x),
            y: f(self.y),
        }
    }

    pub fn symmetric_condition(&self, predicate: impl Fn((i32, i32)) -> bool) -> bool {
        predicate((self.x, self.y)) || predicate((self.y, self.x))
    }

    pub const ZERO: Self = Self { x: 0, y: 0 };
    pub const X: Self = Self { x: 1, y: 0 };
    pub const Y: Self = Self { x: 0, y: 1 };
    pub const VERTICAL: Self = Self { x: 1, y: 1 };
    pub const HORIZONTAL: Self = Self { x: -1, y: 1 };
}

impl std::fmt::Display for Vector {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

/// A 2D vector with floating point coordinates in canonical (or cartesian or standard) basis.
#[derive(Debug, Clone, Copy, PartialEq, Add, AddAssign, Sub, SubAssign, Mul, MulAssign)]
#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub struct CanonicalVector {
    pub x: f32,
    pub y: f32,
}

impl CanonicalVector {
    pub const fn new(x: f32, y: f32) -> Self {
        Self { x, y }
    }

    pub fn from_angle(angle: f32, magnitude: f32) -> Self {
        Self {
            x: angle.cos() * magnitude,
            y: angle.sin() * magnitude,
        }
    }
}

#[cfg_attr(feature = "wasm", wasm_bindgen)]
pub enum Alignment {
    Vertical,
    Horizontal,
}

impl Alignment {
    pub fn basis(&self) -> [CanonicalVector; 2] {
        const SIXTH: f32 = 2.0 * PI / 6.0;
        const TWELFTH: f32 = 2.0 * PI / 12.0;

        match self {
            Alignment::Horizontal => {
                let magnitude = 1.5 / TWELFTH.cos();

                [PI - TWELFTH, TWELFTH].map(|angle| CanonicalVector::from_angle(angle, magnitude))
            }

            Alignment::Vertical => [
                CanonicalVector::new(2.0 * TWELFTH.cos(), 0.0),
                CanonicalVector::from_angle(2.0 * SIXTH, 2.0 * TWELFTH.cos()),
            ],
        }
    }

    pub fn hexagon_points(&self) -> [CanonicalVector; 6] {
        let sqrt_3_on_2 = 3.0_f32.sqrt() / 2.0;

        let points = [
            (1.0, 0.0),
            (0.5, sqrt_3_on_2),
            (-0.5, sqrt_3_on_2),
            (-1.0, 0.0),
            (-0.5, -sqrt_3_on_2),
            (0.5, -sqrt_3_on_2),
        ];

        match self {
            Alignment::Horizontal => points.map(|(x, y)| CanonicalVector::new(x, y)),
            Alignment::Vertical => points.map(|(x, y)| CanonicalVector::new(y, x)),
        }
    }
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl CanonicalVector {
    pub fn svg_points(&self, alignment: Alignment, radius: f32) -> String {
        let points = alignment.hexagon_points();

        points
            .map(|point| point * radius + *self)
            .map(|point| format!("{},{}", point.x, -point.y)) // y is negated cause svg has positive towards bottom
            .join(" ")
    }
}
