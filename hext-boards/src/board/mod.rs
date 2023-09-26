use std::collections::HashMap;

use glam::{ivec2, IVec2};

mod test;

const LEFT_BRACKET: char = '⟨';
const RIGHT_BRACKET: char = '⟩';

/// Convert from hexagonal coordinates to cartesian coordinates
fn hexagonal_to_cartesian(hexagonal_coords: IVec2) -> IVec2 {
    let b1 = ivec2(-5, -1);
    let b2 = ivec2(5, -1);

    b1 * hexagonal_coords.x + b2 * hexagonal_coords.y
}

const STATIC_TILE_ELEMENTS: [(IVec2, char); 8] = [
    (ivec2(-1, 1), '-'),
    (ivec2(0, 1), '-'),
    (ivec2(1, 1), '-'),
    (ivec2(-3, 0), LEFT_BRACKET),
    (ivec2(3, 0), RIGHT_BRACKET),
    (ivec2(-1, -1), '-'),
    (ivec2(0, -1), '-'),
    (ivec2(1, -1), '-'),
];

const DYNAMIC_TILE_ELEMENTS: [(IVec2, char, char); 4] = [
    (ivec2(-2, 1), '\\', RIGHT_BRACKET),
    (ivec2(2, 1), '/', LEFT_BRACKET),
    (ivec2(-2, -1), '/', RIGHT_BRACKET),
    (ivec2(2, -1), '\\', LEFT_BRACKET),
];

/// A hexagonal board, intended for being printed.
///
/// It implements `Display` if `T` can be converted into a `char` and cloned.
/// Otherwise, you can use `render_with`.
#[derive(Debug, Clone, Default)]
pub struct HexagonalBoard<T> {
    /// Mapping from hexagonal coordinates to values
    pub values: HashMap<IVec2, T>,
}

impl<T> HexagonalBoard<T> {
    /// Creates a new empty board
    pub fn char_map_by(&self, to_char: impl Fn(&T) -> char) -> HashMap<IVec2, char> {
        let min_x = self
            .values
            .keys()
            .map(|pos| pos.x - pos.y)
            .max()
            .unwrap_or(0);
        let max_y = self
            .values
            .keys()
            .map(|pos| pos.x + pos.y)
            .max()
            .unwrap_or(0);

        let origin_offset = ivec2(5 * min_x + 3, max_y + 1);

        let mut output: HashMap<IVec2, char> = HashMap::new();

        for (hexagonal_coords, value) in &self.values {
            // Get cartesian coordinates
            let cartesian_coords = hexagonal_to_cartesian(*hexagonal_coords) + origin_offset;

            // Insert value in center
            output.insert(cartesian_coords, to_char(value));

            // Add top and sides, which are always the same
            for (offset, char) in STATIC_TILE_ELEMENTS {
                output.insert(cartesian_coords + offset, char);
            }

            // Add edges, which depend if a tile has neighbours
            for (offset, single, multiple) in DYNAMIC_TILE_ELEMENTS {
                match output.get(&(cartesian_coords + offset)) {
                    None => output.insert(cartesian_coords + offset, single),
                    Some(&RIGHT_BRACKET | &LEFT_BRACKET) => None,
                    Some(_) => output.insert(cartesian_coords + offset, multiple),
                };
            }
        }

        output
    }

    /// Render the board into a `String` using the specified conversion function to `char`
    pub fn render_with(&self, to_char: impl Fn(&T) -> char) -> String {
        render(self.char_map_by(to_char))
    }
}

impl<T: Into<char> + Clone> HexagonalBoard<T> {
    /// Creates a map from a position in the terminal to the character it should output
    pub fn char_map(&self) -> HashMap<IVec2, char> {
        self.char_map_by(|value| value.clone().into())
    }
}

/// Render a map of `position => char` into a `String`
pub fn render(char_map: HashMap<IVec2, char>) -> String {
    let mut lines: Vec<Vec<char>> = Vec::new();

    for (position, char) in char_map {
        let y = position.y as usize;
        let x = position.x as usize;

        while lines.len() <= y {
            lines.resize(y + 1, Vec::new());
        }

        if lines[y].len() <= x {
            lines[y].resize(x + 1, ' ');
        }

        lines[y][x] = char;
    }

    let mut output =
        String::with_capacity(lines.len() * lines.get(0).map(|x| x.len()).unwrap_or(0));

    for (i, line) in lines.iter().enumerate() {
        output.push_str(&String::from_iter(line));

        if i != lines.len() - 1 {
            output.push('\n');
        }
    }

    output
}

impl<const N: usize, T> From<[(IVec2, T); N]> for HexagonalBoard<T> {
    fn from(value: [(IVec2, T); N]) -> Self {
        Self {
            values: HashMap::from(value),
        }
    }
}

impl<T> FromIterator<(IVec2, T)> for HexagonalBoard<T> {
    fn from_iter<I: IntoIterator<Item = (IVec2, T)>>(iter: I) -> Self {
        Self {
            values: iter.into_iter().collect(),
        }
    }
}

impl<T: Into<char> + Clone> std::fmt::Display for HexagonalBoard<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&render(self.char_map()))
    }
}
