#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Status {
	Checkmate,
	Draw(DrawReason),
	InProgress,
}

// TODO: Should timer *things* be here?
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DrawReason {
	Stalemate,
	InsufficientMaterial,
	ThreefoldRepetition,
	FiftyMoveRule,
}
