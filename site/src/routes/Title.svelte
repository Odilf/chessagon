<script>
  import { Vector } from "$engine/chessagon";
  import Tile from "$lib/board/Tile.svelte";
  import Svg from "$lib/utils/SVG.svelte";
</script>

<div class="w-screen grid place-items-center overflow-hidden">
  <div class="wrapper">
    <div class="text">
      <h1>Chessagon</h1>
      <p>Hexagonal chess</p>
    </div>

    <div class="svg opacity-50">
      <Svg size={new Vector(2, 2)}>
        <Tile position={new Vector(0, 0)} flip={false} />
      </Svg>
    </div>
  </div>
</div>

<style>
  .text {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    filter: drop-shadow(0 0 0.5em hsla(0, 0%, 100%, 0.2));
    z-index: 20;

    display: flex;
    flex-direction: column;
  }

  h1 {
    all: unset;
    margin: 0;
    font-weight: 700;
    font-size: min(20vh, 15vw);
    line-height: 1;
  }

  p {
    font-size: calc(1rem + 3vw);
  }

  .wrapper {
    position: relative;
    width: 70vmin;
    height: 50vmin;
  }

  .svg {
    position: absolute;
    animation: spin 10s linear infinite;
    height: 100%;
  }

  :root {
    --pre-spin-transform: translateX(60%);
  }

  @keyframes spin {
    from {
      transform: var(--pre-spin-transform) rotate(0deg);
    }
    to {
      transform: var(--pre-spin-transform) rotate(360deg);
    }
  }
</style>
