# Chessagon

Hexagonal chess. The project includes both and engine written in Rust (which compiles to wasm), a web frontend written in Svelte and a CLI "frontend".

## Engine

Currently, the Rust engine has a relatively small and focused API. It only supports Glinksky hexagonal chess.

### Usage

Add the project:

```bash
cargo add chessagon
```

Then use it

```rust
use chessagon::{game::GameState, moves::Move, vector::Vector};

fn main() {
    let mut game = GameState::new();

	// Move the central pawn forward one space
    game.try_move(Move::new(Vector::new(-1, -1), Vector::new(0, 0)))
        .unwrap();

	// An invalid move fails and tells you why
	let err = game.try_move(Move::new(Vector::new(-1, -1), Vector::new(0, 0)))
        .unwrap_err();

	println!("{}", err);
	// Prints `attempt to move from (-1, -1), but there isn't a piece there``
}
```

As a personal note, the reason I chose to use Rust for the engine was not primarily to make it fast. My first option was to make it in js, but for something that has complex self-contained logic, I thought that Rust would be much more ergonomic, quick and easy. Indeed, it turned out to be more complex than I thought at first so I'm glad I didn't go with js. The fact that it is very performant is an amazing side benefit.

Speaking of which, the engine doesn't have any huge inneficiencies, but it could definitly be improved performance wise (for example, using bitboards and doing checks in a smarter way). This seems it would be something important if we want to incorporate search and move evaluation. 

## Web

The web frontend is made with Svelte (and SvelteKit). All the logic can be run directly in the browser since the engine compiles to wasm. In fact, the server also uses the wasm engine to validate moves. This is because we want to use SvelteKit since it has a bunch of advantage and better DX but it assumes we're using JS on the backend. So, even though the server can run native code produced by Rust and we could do some FFI to run it from Node (or Deno or Bun), it's easier to just use wasm directly. This is the reason why wasm as a universal runtime is a cool shit.

In the website you can play games online with other people, with live updates, ELO, and all that jazz. 

## CLI

There's also a CLI. You can install it with

```bash
cargo install chessagon-cli
```

(assuming you have Cargo).

Using a CLI is a very sub-optimal interface to interact with chess, but I thought it was the simplest way to interact with the engine, since the engine itself is just a library. 
