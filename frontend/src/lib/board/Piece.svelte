<script context='module'>
	const urls = {
		black: {
			king: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
			queen: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
			rook: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
			bishop: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
			knight: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
			pawn: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
		},

		white: {
			king: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
			queen: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
			rook: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
			bishop: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
			knight: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
			pawn: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',

		}
	}
</script>

<script lang="ts">
	import { hexToCart, type Alignment } from "$lib/vectors";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import { alignmentKey } from "./Board.svelte";
	import type { Piece } from "./pieces";	

	export let piece: Piece
	export let color: 'black' | 'white'

	$: coord = hexToCart(piece.position, $alignment)

	export let size = 1.4
	const alignment = getContext(alignmentKey) as Writable<Alignment>
</script>

<image x={coord.x - size/2} y={coord.y - size/2} width={size}
href={urls[color][piece.type]} on:click />

<style>
	image {
		cursor: pointer;
	}
</style>