<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import CanvasHolder from '$lib/components/CanvasHolder.svelte';
</script>

<svelte:head>
	<title>pxl - Canvas</title>
</svelte:head>

<Header home_button={true} shop_button={true} is_canvas={true}></Header>

<div class="page-content">
	<br />

	<div class="para">
		<h1 class="rainbow">Canvas Closed</h1>
		<p>Pxl has ended and the canvas is locked, thanks for participating!</p>
	</div>

	<div class="canvas-layout">
		<CanvasHolder editable={false} on_homepage={true}></CanvasHolder>
	</div>
</div>

<style>
	.rainbow {
		-webkit-text-stroke: 0.5px black;
		font-size: 3rem;

		background: repeating-linear-gradient(
			90deg,
			#ff0000 0px 8px,
			#ff8000 8px 16px,
			#ffff00 16px 24px,
			#00ff00 24px 32px,
			#00ffff 32px 40px,
			#0000ff 40px 48px,
			#8000ff 48px 56px
		);

		-webkit-background-clip: text;
		color: transparent;

		animation: pixelMove 2s steps(7) infinite;
	}
	@keyframes pixelMove {
		from {
			background-position: 0px 0px;
		}
		to {
			background-position: 56px 0px;
		}
	}
</style>
