#![cfg(test)]

use super::*;

use indoc::indoc;
use pretty_assertions::assert_eq;

#[test]
fn single() {
    let board = HexagonalBoard::from([(ivec2(0, 0), 'a')]);

    let output = format!("{board}");

    const EXPECTED: &str = indoc! {r"
         /---\
        ⟨  a  ⟩
         \---/
    "};

    assert_eq!(output, EXPECTED.trim_matches('\n'));
}

#[test]
fn four() {
    let board = HexagonalBoard::from([
        (ivec2(0, 0), 'a'),
        (ivec2(1, 0), 'b'),
        (ivec2(0, 1), 'c'),
        (ivec2(-1, -1), 'd'),
    ]);

    let output = format!("{board}");

    const EXPECTED: &str = indoc! {r"
         /---\     /---\
        ⟨  b  ⟩---⟨  c  ⟩
         \---⟨  a  ⟩---/
              ⟩---⟨
             ⟨  d  ⟩
              \---/
    "};

    assert_eq!(output, EXPECTED.trim_matches('\n'));
}

#[test]
fn empty_center() {
    let board = HexagonalBoard::from([(ivec2(1, 1), 't'), (ivec2(-1, -1), 'b')]);

    let output = format!("{board}");

    print!("{board}");

    const EXPECTED: &str = indoc! {r"
             /---\
            ⟨  t  ⟩
             \---/

             /---\
            ⟨  b  ⟩
             \---/
    "};

    assert_eq!(output, EXPECTED.trim_matches('\n'));
}
