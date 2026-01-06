<script lang="ts">
	import Canvas from '$lib/components/Canvas.svelte';

	export let editable = true;
	export let currentColor: string = '#FF0000';
	export let on_homepage = false;
</script>

<div
	class={on_homepage ? 'canvas-holder-homepage' : 'canvas-holder'}
	on:contextmenu|preventDefault
	role="region"
	aria-label="Canvas area">
	<Canvas {editable} {currentColor} on:pixelPlaced></Canvas>
</div>
