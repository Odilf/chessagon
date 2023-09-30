<script context="module">
  export const alignmentKey = Symbol("alignment");

  // TODO: Get this from rust, when new version of wasm-bindgen is out
  const getPositions = () => {
    let output = [];

    for (let x = -5; x <= 5; x++) {
      for (let y = -5; y <= 5; y++) {
        if (Math.abs(x - y) <= 5) {
          output.push(new Vector(x, y));
        }
      }
    }

    return output;
  };

  export const positions = getPositions();
</script>

<script lang="ts">
  import { Alignment, Board, Color, Piece, Vector, should_flip } from "$engine";
  import Svg from "$lib/utils/SVG.svelte";
  import { createEventDispatcher, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { fade } from "svelte/transition";
  import PieceComponent from "./Piece.svelte";
  import Tile from "./Tile.svelte";

  export let board = new Board();
  export let highlightPositions: Vector[] = [];
  export let selected: Piece | null = null;
  export let playerColor: Color;

  $: flip = should_flip(playerColor);

  export let highlightEasing = (target: Vector) => {
    const canonic = [
      (selected?.position ?? new Vector(0, 0)).to_canonic(
        Alignment.Horizontal,
        flip,
      ),
      target.to_canonic(Alignment.Horizontal, flip),
    ];
    const distance = Math.sqrt(
      (canonic[0].x - canonic[1].x) ** 2 + (canonic[0].y - canonic[1].y) ** 2,
    );
    return [distance * 10 + 50, distance * 5];
  };

  setContext(alignmentKey, writable(Alignment.Horizontal));

  const dispatch = createEventDispatcher<{
    move: { from: Vector; to: Vector };
    selection: { piece: Piece | null };
  }>();

  // Select and deselects piece
  function select(piece: Piece | null) {
    if (selected === piece) {
      selected = null;
    } else {
      selected = piece;
    }

    dispatch("selection", { piece });
  }

  $: piecesOf = (color: Color) =>
    positions
      .filter((p) => board.piece_at(p)?.color === color)
      .map((p) => board.piece_at(p));
</script>

<!-- @component
A completely inhert board. This means that it does not have any logic, doesn't highlight, and
does not know about the game state. It just displays pieces.

It has events for moves, but the moves may be invalid.
 -->

<Svg size={new Vector(17, 19)}>
  <g id="tiles">
    {#each positions as position}
      <Tile {flip} {position} on:click={() => (selected = null)} />
    {/each}
  </g>

  <g id="indicators">
    {#each highlightPositions as position (position)}
      {@const [duration, delay] = highlightEasing(position)}
      <g class="indicator" transition:fade={{ duration, delay }}>
        <Tile
          {flip}
          {position}
          on:click={() => {
            if (selected) {
              dispatch("move", { from: selected.position, to: position });
            }
          }}
        />
      </g>
    {/each}
  </g>

  <g id="pieces">
    {#each [Color.White, Color.Black] as color}
      <g class={playerColor == color ? "player" : "opponent"}>
        {#each piecesOf(color) as piece (piece)}
          {#if piece}
            <PieceComponent
              {flip}
              {piece}
              on:click={() => piece && select(piece)}
            />
          {/if}
        {/each}
      </g>
    {/each}
  </g>
</Svg>

<style>
  #indicators {
    cursor: pointer;
    filter: hue-rotate(60deg) brightness(110%)
      drop-shadow(0 0 0.1px hsla(250, 60%, 50%, 0.3));
  }

  .opponent {
    pointer-events: none;
  }

  .indicator {
    transition: cubic-bezier(0.455, 0.03, 0.515, 0.955) 100ms;
  }

  .indicator:hover {
    filter: brightness(110%);
  }
</style>
