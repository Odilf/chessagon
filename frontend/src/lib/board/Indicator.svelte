<script lang="ts">
	import { hexToCart, type Vector } from "$lib/vectors";
	import { draw, fade, scale } from "svelte/transition";
	import { quintOut } from 'svelte/easing'

	export let position: Vector
	export let inDuration: number = 100

	$: coords = hexToCart(position)
</script>

<circle cx={coords.x} cy={coords.y} r=0.25 fill=green opacity=0.4
in:scale={{ duration: inDuration, start: 0.5, opacity: 0.8, easing: quintOut }}
out:fade={{ duration: 100, easing: quintOut }}
/>

<style>
	circle {
		pointer-events: none;
	}
</style>