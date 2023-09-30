<script lang="ts">
  import { Vector } from "$engine/chessagon";

  export let size: Vector = new Vector(20, 20);

  $: viewBox = `${-size.x / 2} ${-size.y / 2} ${size.x} ${size.y}`;
</script>

<svg {viewBox}>
  <slot />
</svg>

<style>
  svg {
    height: 100%;
    width: 100%;
  }
</style>
