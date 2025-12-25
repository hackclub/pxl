<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/assets/styles/main.css';

	// Imports:
	import pxlTitle from '$lib/assets/pxl-title.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400&display=swap"
		rel="stylesheet" />
</svelte:head>

{@render children?.()}
