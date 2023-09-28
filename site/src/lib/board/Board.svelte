<script context="module">
  export const alignmentKey = Symbol("alignment");
</script>

<script lang="ts">
  import { Color, Piece, Vector, GameState, Alignment } from "$engine";
  import { fade } from "svelte/transition";
  import PieceComponent from "./Piece.svelte";
  import Tile from "./Tile.svelte";
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  export let game = new GameState();

  setContext(alignmentKey, writable(Alignment.Horizontal));

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

  const positions = getPositions();

  let selected: Piece | null = null;

  // Select and deselects piece
  function select(piece: Piece | null) {
    if (selected === piece) {
      selected = null;
    } else {
      selected = piece;
    }
  }

  $: highlighted = positions.filter((position) =>
    selected
      ? game.can_move(selected.position, position) ||
        selected.position.toString() == position.toString()
      : false,
  );

  $: if (game.is_checkmate()) {
    alert("Checkmate!");
  }

  const try_move = (from: Vector, to: Vector) => {
    try {
      game.try_move(from, to);
      game = game;
      selected = null;
    } catch (e) {
      console.log(e);
    }
  };
</script>

<!-- 20x20 box, centered at 0 -->
<svg viewBox="-10 -10 20 20">
  <g id="tiles">
    {#each positions as position}
      <Tile {position} on:click={() => (selected = null)} />
    {/each}
  </g>

  <g id="indicators">
    {#each highlighted as position}
      {@const duration = selected
        ? Math.sqrt(
            (selected.position.x - position.x) ** 2 +
              (selected.position.x - position.x) ** 2,
          ) *
            20 +
          20
        : 100}
      <g class="indicator" transition:fade={{ duration }}>
        {#key selected}
          <Tile
            {position}
            on:click={() => selected && try_move(selected.position, position)}
          />
        {/key}
      </g>
    {/each}
  </g>

  <g id="pieces">
    {#each [Color.White, Color.Black] as color}
      <g class={game.current_color() == color ? "player" : "opponent"}>
        {#each positions
          .filter((p) => game.board.piece_at(p)?.color === color)
          .map((p) => game.board.piece_at(p)) as piece (piece)}
          {#if piece}
            <PieceComponent {piece} on:click={() => piece && select(piece)} />
          {/if}
        {/each}
      </g>
    {/each}
  </g>
</svg>

<style>
  svg {
    height: 95vh;
  }

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
