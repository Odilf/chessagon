<script lang="ts">
	import { coordsToSVGString } from "$lib/utils";
	import { hexagonPoints, hexToCart, sum, Vector, type Alignment } from "$lib/vectors";	
	import { getContext } from "svelte";
import type { Writable } from "svelte/store";
	import { alignmentKey } from "./Board.svelte";

	export let position: Vector
	export let r = 1
	export let color: {h: number, s: number, l: number}

	const alignment = getContext(alignmentKey) as Writable<Alignment>

	$: cartCoords = hexToCart(position, $alignment)
	$: points = coordsToSVGString(hexagonPoints[$alignment].map(p => sum(p.scale(r), cartCoords)))

	$: fill = `hsl(${color.h}, ${color.s}%, ${color.l}%`
</script>

<polygon name="hexagon" {points} {fill} on:click on:mousedown={() => console.log(position)}/>

<style>
	polygon {
		transition: cubic-bezier(0.77, 0, 0.175, 1) 100ms
	}

	polygon:active {
		filter: brightness(90%);
	}
</style>