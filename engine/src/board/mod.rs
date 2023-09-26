pub mod peekable;
pub mod standard;

use once_cell::sync::Lazy;

use crate::{
    moves::{CheckedMove, IllegalMove, Move},
    piece::{
        rook, Color, Piece, PieceType, {bishop, king, knight, pawn, queen},
    },
    vector::Vector,
};

use self::peekable::PeekableBoard;

pub trait BoardTrait: Sized {
    fn piece_at(&self, position: Vector) -> Option<&Piece>;

    /// Checks if there are any blockers in the path of a move.
    /// If there is a piece in it's path it returns an `Err(IllegalMove::Blocked(...))`.
    ///
    /// If the last piece is of the opposite color, it returns it's position. Otherwise it returns `Ok(None)`.
    ///
    /// If the stride is not a multiple of the move's
    /// delta, this function will loop infinitely (though it will panic in debug mode).
    ///
    /// This function assumes that there is a piece at the origin. (TODO: reconsider this)
    ///
    /// # Panics
    /// This function will panic if the stride is not a multiple of the move's delta.
    ///
    /// It also panics if it finds a blocker and there is no piece at the origin.
    fn check_for_blockers(
        &self,
        mov: &Move,
        stride: Vector,
        color: Color,
    ) -> Result<Option<Vector>, IllegalMove> {
        if cfg!(debug_assertions) {
            assert!(
                mov.delta().multiplicity_of(&stride).is_some(),
                "Stride must be a multiple of the move's delta (stride: {}, delta: {})",
                stride,
                mov.delta()
            );
        }

        let blocked = |blocker: &Piece| {
            Err(IllegalMove::Blocked(
                self.piece_at(mov.origin)
                    .expect("There should be a piece at the origin")
                    .clone(),
                mov.target,
                blocker.clone(),
            ))
        };

        let mut current = mov.origin + stride;
        while current != mov.target {
            if let Some(blocker) = self.piece_at(current) {
                return blocked(blocker);
            }

            current += stride;
        }

        if let Some(piece_at_target) = self.piece_at(current) {
            return if piece_at_target.is_opponent(color) {
                Ok(Some(current))
            } else {
                blocked(piece_at_target)
            };
        }

        Ok(None)
    }

    fn try_move_pre_pins(
        &self,
        mov: &Move,
        player_color: Color,
        last_move: Option<&Move>,
    ) -> Result<Option<Vector>, IllegalMove> {
        let Some(piece) = &self.piece_at(mov.origin) else {
            return Err(IllegalMove::NotAPieceThere(mov.origin));
        };

        let piece_type = piece.typ;
        let color = piece.color;

        if color != player_color {
            return Err(IllegalMove::InvalidColor(color));
        }

        if mov.origin == mov.target {
            return Err(IllegalMove::OutOfReach(piece_type, *mov));
        }

        match piece_type {
            PieceType::Pawn => pawn::try_move(mov, color, self, last_move),
            PieceType::Knight => knight::try_move(mov, color, self),
            PieceType::Rook => rook::try_move(mov, color, self),
            PieceType::Bishop => bishop::try_move(mov, color, self),
            PieceType::Queen => queen::try_move(mov, color, self),
            PieceType::King => king::try_move(mov, color, self),
        }
    }
}

pub trait BoardTraitMut: BoardTrait {
    fn piece_at_mut(&mut self, position: Vector) -> Option<&mut Piece>;

    fn capture(&mut self, at: &Vector) -> Option<Piece>;

    /// Returns a peek at the board after the move has been made. This is made so that you can get a peek at the board
    /// without needing a mutable reference to the original, nor cloning.
    ///
    /// Behind the scenes it mostly references the original board while keeping
    /// TODO: finish writing docs
    fn peek(
        &self,
        mov: &Move,
        player_color: Color,
        last_move: Option<&Move>,
    ) -> Result<PeekableBoard, IllegalMove>;

    /// Determines whether a move is legal, and returns the position of the captured piece if it is.
    fn check_move(
        &self,
        mov: Move,
        player_color: Color,
        last_move: Option<&Move>,
    ) -> Result<CheckedMove, IllegalMove> {
        let peeked_board = self.peek(&mov, player_color, last_move)?;

        let mut checking_pieces = peeked_board
            .checking_pieces(player_color, last_move.cloned())
            .peekable();

        if checking_pieces.peek().is_some() {
            let checking_pieces = checking_pieces.cloned().collect();
            let err = Err(IllegalMove::Pin(
                self.piece_at(mov.origin).unwrap().clone(),
                checking_pieces,
            ));

            return err;
        };

        Ok(CheckedMove {
            mov,
            capture_target: peeked_board.capture_target,
        })
    }

    fn execute(&mut self, checked_move: CheckedMove) -> Option<Piece> {
        let CheckedMove {
            mov,
            capture_target,
        } = checked_move;

        let captured_piece = capture_target.and_then(|target| self.capture(&target));

        let piece = self
            .piece_at_mut(mov.origin)
            .expect("There should be a piece in `mov.origin`");

        piece.move_to(mov.target);

        captured_piece
    }

    fn try_move(
        &mut self,
        mov: Move,
        player_color: Color,
        last_move: Option<&Move>,
    ) -> Result<Option<Piece>, IllegalMove> {
        let checked_move = self.check_move(mov, player_color, last_move)?;

        Ok(self.execute(checked_move))
    }
}

pub const SIZE: i32 = 5;

// TODO: Make const
pub fn positions() -> Lazy<Vec<Vector>> {
    Lazy::new(|| position_iter().collect())
}

fn generate_board_pieces() -> Vec<Piece> {
    let mut pieces = Vec::with_capacity(36);

    let mut insert = |x, y, color, piece_type| {
        let item = Piece::new(color, piece_type, Vector::new(x, y));
        pieces.push(item);
    };

    use Color::*;
    use PieceType::*;

    // Pawns
    insert(-1, -1, White, Pawn);
    insert(1, 1, Black, Pawn);

    for i in 2..=5 {
        insert(-i, -1, White, Pawn);
        insert(-1, -i, White, Pawn);
        insert(i, 1, Black, Pawn);
        insert(1, i, Black, Pawn);
    }

    // Rooks, knights, bishops for both colors
    for (i, color) in [(-1, White), (1, Black)] {
        insert(5 * i, 2 * i, color, Rook);
        insert(2 * i, 5 * i, color, Rook);

        insert(5 * i, 3 * i, color, Knight);
        insert(3 * i, 5 * i, color, Knight);

        insert(5 * i, 5 * i, color, Bishop);
        insert(4 * i, 4 * i, color, Bishop);
        insert(3 * i, 3 * i, color, Bishop);
    }

    // Queens and kings
    insert(-5, -4, White, King);
    insert(-4, -5, White, Queen);

    insert(5, 4, Black, Queen);
    insert(4, 5, Black, King);

    pieces
}

fn checking_pieces<'a>(
    board: &'a impl BoardTrait,
    color: Color,
    last_move: Option<Move>,
    king: &'a Piece,
    pieces: impl Iterator<Item = &'a Piece>,
) -> impl Iterator<Item = &'a Piece> + {
    pieces
        .filter(move |piece| piece.color == color.opposite())
        .filter(move |piece| {
            let mov = Move::new(piece.position, king.position);

            board.try_move_pre_pins(&mov, color.opposite(), last_move.as_ref())
                .is_ok()
        })
}

pub fn position_iter() -> impl Iterator<Item = Vector> {
    (-5..5).flat_map(|x| (-5..5).map(move |y| Vector::new(x, y)))
}
