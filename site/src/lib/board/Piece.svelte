<script context="module" lang="ts">
  const commons = "https://upload.wikimedia.org/wikipedia/commons/";

  const black = {
    [PieceType.King]: new URL(commons + "f/f0/Chess_kdt45.svg"),
    [PieceType.Queen]: new URL(commons + "4/47/Chess_qdt45.svg"),
    [PieceType.Rook]: new URL(commons + "f/ff/Chess_rdt45.svg"),
    [PieceType.Bishop]: new URL(commons + "9/98/Chess_bdt45.svg"),
    [PieceType.Knight]: new URL(commons + "e/ef/Chess_ndt45.svg"),
    [PieceType.Pawn]: new URL(commons + "c/c7/Chess_pdt45.svg"),
  } as const;

  const white = {
    [PieceType.King]: new URL(commons + "4/42/Chess_klt45.svg"),
    [PieceType.Queen]: new URL(commons + "1/15/Chess_qlt45.svg"),
    [PieceType.Rook]: new URL(commons + "7/72/Chess_rlt45.svg"),
    [PieceType.Bishop]: new URL(commons + "b/b1/Chess_blt45.svg"),
    [PieceType.Knight]: new URL(commons + "7/70/Chess_nlt45.svg"),
    [PieceType.Pawn]: new URL(commons + "4/45/Chess_plt45.svg"),
  } as const;

  const urls = {
    [Color.Black]: black,
    [Color.White]: white,
  } as const;
</script>

<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { Writable } from "svelte/store";
  import { alignmentKey } from "./Board.svelte";
  import { Alignment, type Piece, Color } from "$engine";
  import { PieceType } from "$engine";

  export let piece: Piece;
  export let flip: boolean;

  export let size = 1.4;
  const alignment = getContext(alignmentKey) as Writable<Alignment>;

  $: coord = piece.position.to_canonic($alignment, flip);

  // @ts-ignore
  const href: string = urls[piece.color][piece.typ].toString();
</script>

<!-- Negating the y cord seems like a slight bodge -->
<image
  on:click|stopPropagation
  on:keydown
  role="button"
  tabindex="0"
  class="piece {Color[piece.color]}"
  x={coord.x - size / 2}
  y={-coord.y - size / 2}
  width={size}
  height={size}
  {href}
/>

<style>
  image {
    cursor: pointer;
    padding: 0;
  }

  *:focus {
    outline: none;
  }
</style>
