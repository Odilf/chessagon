#![cfg(test)]

use crate::{game::GameState, moves::parse};

#[test]
fn game() {
    let mut game = GameState::default();

    let moves = [
        ("-1, -1 to -1, -1", false),
        ("-1, -1 to 0, 0", true),
    ];

    for (mov, is_ok) in moves {
        let mov = parse::algebraic(mov).unwrap();
        let result = game.try_move(mov);
        assert_eq!(result.is_ok(), is_ok, "mov: {mov:?} \nres: {:?}", result);
    }
}

#[test]
fn pins() {
    let mut game = GameState::default();

    let moves = [
        ("-2,-1 by 2,2", true),
        ("2,5 to 2,3", true),
        ("0,1 to 1,1", true),
        ("1,2 to 1,1", true),
        ("-1,-1 by 1,1", false),
    ];

    for (mov, is_ok) in moves {
        println!("Doing move {:?}", mov);
        let mov = parse::algebraic(mov).unwrap();
        assert_eq!(game.try_move(mov.clone()).is_ok(), is_ok, "{:?}", mov);
    }
}
