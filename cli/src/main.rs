mod board;
mod runner;

use runner::CliRunner;

fn main() {
    let mut runner = CliRunner::default();

    runner.run().unwrap();
}
