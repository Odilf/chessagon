use crate::piece::Color;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Status {
    /// Color has won by checkmate
    Checkmate(Color),

    /// Color has won because opponent has run out of time
    OutOfTime(Color),

    Draw(DrawReason),
    InProgress,
}

// TODO: Should timer *things* be here?
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DrawReason {
    Agreement,
    Stalemate,
    InsufficientMaterial,
    ThreefoldRepetition,
    FiftyMoveRule,
}

impl Status {
    /// Returns a custom status code.
    ///
    /// `1XX` values are for white wins, `2XX` are for black wins and `3XX` are for draws.
    pub const fn code(&self) -> i32 {
        type S = Status;

        match self {
            S::InProgress => 0,

            S::Checkmate(Color::White) => 100,
            S::Checkmate(Color::Black) => 200,
            S::OutOfTime(Color::White) => 101,
            S::OutOfTime(Color::Black) => 201,

            S::Draw(DrawReason::Agreement) => 300,
            S::Draw(DrawReason::Stalemate) => 301,
            S::Draw(DrawReason::InsufficientMaterial) => 302,
            S::Draw(DrawReason::ThreefoldRepetition) => 303,
            S::Draw(DrawReason::FiftyMoveRule) => 304,
        }
    }

    pub const fn from_code(code: i32) -> Option<Self> {
        type S = Status;

        let status = match code {
            0 => S::InProgress,

            100 => S::Checkmate(Color::White),
            200 => S::Checkmate(Color::Black),
            101 => S::OutOfTime(Color::White),
            201 => S::OutOfTime(Color::Black),

            300 => S::Draw(DrawReason::Agreement),
            301 => S::Draw(DrawReason::Stalemate),
            302 => S::Draw(DrawReason::InsufficientMaterial),
            303 => S::Draw(DrawReason::ThreefoldRepetition),
            304 => S::Draw(DrawReason::FiftyMoveRule),

            _ => return None,
        };

        Some(status)
    }
}
