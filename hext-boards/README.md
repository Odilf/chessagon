# hex-boards

A small library that renders hexagonal boards on the terminal.

## Example

```rust
use hext_boards::HexagonalBoard;
use glam::ivec2;

let board = HexagonalBoard::from([
    (ivec2(0, 0), 'a'),
    (ivec2(1, 0), 'b'),
    (ivec2(0, 1), 'c'),
    (ivec2(-1, -1), 'd'),
]);

let output = board.to_string();

// Also works
println!("{board}");

/* Output is the following:

 /---\     /---\
⟨  b  ⟩---⟨  c  ⟩
 \---⟨  a  ⟩---/
      ⟩---⟨
     ⟨  d  ⟩
      \---/
*/
```
