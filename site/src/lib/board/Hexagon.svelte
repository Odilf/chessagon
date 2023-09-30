<script lang="ts">
  import { Alignment, Vector } from "$engine";

  export let position: Vector;
  export let radius = 1;
  export let flip;
  export let color: { h: number; s: number; l: number };

  const canonic = position.to_canonic(Alignment.Horizontal, flip);
  const points = canonic.svg_points(Alignment.Horizontal, radius);

  const fill = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
</script>

<polygon
  name="hexagon"
  {points}
  {fill}
  on:click
  on:keypress
  role="button"
  tabindex="0"
/>

<style>
  polygon {
    transition: cubic-bezier(0.77, 0, 0.175, 1) 100ms;
    cursor: inherit;
  }

  polygon:activ {
    filter: brightness(90%);
  }

  *:focus {
    outline: none;
  }
</style>
