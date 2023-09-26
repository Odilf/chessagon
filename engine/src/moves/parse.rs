use peg::str::LineCol;
use thiserror::Error;

use crate::vector::Vector;

use super::Move;

type PegParseError<L> = peg::error::ParseError<L>;

peg::parser! {
    grammar moves() for str {
        pub rule __ = quiet! { [' ' | '\t' | '\n']* }

        pub rule number() -> i32
            = n:$( "-"? ['0'..='9']+)
            { n.parse().unwrap() }

        pub rule vector() -> Vector
            = x:number() __ "," __ y:number()
            { Vector::new(x, y) }

        rule algebraic_absolute() -> Move
            = __ from:vector() __ "to" __ to:vector() __
            { Move::new(from, to) }

        rule algebraic_relative() -> Move
            = __ from:vector() __ "by" __ delta:vector() __
            { Move::new(from, from + delta) }

        pub rule algebraic() -> Move =
            algebraic_absolute() / algebraic_relative()
    }
}

#[derive(Debug, Error)]
pub struct ParseError<L = LineCol> {
    // TODO: Maybe I should make this generic?
    pub peg_err: PegParseError<L>,
    pub src: String,
}

impl std::fmt::Display for ParseError<LineCol> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let loc = &self.peg_err.location;

        let chic_error = chic::Error::new("Parse error").error(
            loc.line,
            loc.offset + loc.line - 1,
            loc.offset + loc.line,
            &self.src,
            format!("Expected: {}", self.peg_err.expected),
        );

        f.write_str(&chic_error.to_string())
    }
}

fn use_parser<T, F>(peg_parser: F, input: &str) -> Result<T, ParseError>
where
    F: Fn(&str) -> Result<T, PegParseError<LineCol>>,
{
    peg_parser(input).map_err(|peg_err| ParseError {
        peg_err,
        src: input.to_string(),
    })
}

pub fn algebraic(input: &str) -> Result<Move, ParseError> {
    use_parser(moves::algebraic, input)
}
