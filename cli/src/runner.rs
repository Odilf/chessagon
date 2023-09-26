use thiserror::Error;

use chessagon::{
    game::GameState,
    moves::{self, parse::ParseError},
};
use rustyline::{error::ReadlineError, DefaultEditor};

use crate::board::render_board;

const VERSION: &str = env!("CARGO_PKG_VERSION");

#[derive(Debug, Clone)]
pub struct CliRunner {
    state: GameState,
    reprint_board: bool,
}

impl Default for CliRunner {
    fn default() -> Self {
        Self {
            state: GameState::default(),
            reprint_board: true,
        }
    }
}

const HISTORY_PATH: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/chessagon.sqlite3");

impl CliRunner {
    pub fn run(&mut self) -> rustyline::Result<()> {
        println!("Chessagon (v{VERSION})");

        let mut editor = DefaultEditor::new()?;

        if editor.load_history(HISTORY_PATH).is_err() {
            println!("No previous history.");
        }

        loop {
            if self.reprint_board {
                println!("{}", render_board(&self.state.board));
                self.reprint_board = false;
            }

            let readline = editor.readline(">> ");
            match readline {
                Ok(line) => {
                    editor.add_history_entry(&line)?;
                    if let Err(err) = self.process_line(&line) {
                        println!("Error: {}", err);
                    }
                }

                Err(ReadlineError::Interrupted) => {
                    println!("CTRL-C");
                    break;
                }
                Err(ReadlineError::Eof) => {
                    println!("CTRL-D");
                    break;
                }
                Err(err) => {
                    println!("Error: {:?}", err);
                    break;
                }
            }
        }

        editor.save_history(HISTORY_PATH)?;

        Ok(())
    }

    fn process_line(&mut self, line: &str) -> Result<(), ProcessLineError> {
        let mov = moves::parse::algebraic(line)?;

        self.state.try_move(mov)?;

        self.reprint_board = true;

        Ok(())
    }
}

#[derive(Debug, Error)]
pub enum ProcessLineError {
    #[error("{0}")]
    ParseError(#[from] ParseError),

    #[error("{0}")]
    IllegalMove(#[from] moves::IllegalMove),
}
