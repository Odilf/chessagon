use chessagon::game::Board;
use termion::event::{Key, Event};
use termion::input::{TermRead, MouseTerminal};
use termion::raw::IntoRawMode;
use std::io::{Write, stdout, stdin};

fn main() {
    let stdin = stdin();
    let mut stdout = MouseTerminal::from(stdout().into_raw_mode().unwrap());
    // let mut stdout = MouseTerminal::from(stdout().into_raw_mode().unwrap());
	// let stdout = stdout;

	let board = Board::default();

	write!(stdout, "{board}").unwrap();

    for c in stdin.events() {
        let event = c.unwrap();

		write!(stdout, "{board}").unwrap();
		
        match event {
            Event::Key(Key::Ctrl('c')) => break,
            Event::Key(Key::Left) => print!("wow"),
            _ => {}
        }

        stdout.flush().unwrap();

		
    }
}
