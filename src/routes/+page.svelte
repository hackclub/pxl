<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import Header from '$lib/components/Header.svelte';
	import CanvasHolder from '$lib/components/CanvasHolder.svelte';
	import AdminButton from '$lib/components/AdminButton.svelte';
	import '$lib/assets/styles/home.css';
	import { goto } from '$app/navigation';
	export let data: { adminViewer: boolean; signedIn: boolean; isBetaTester: boolean };
	const user_is_admin = data.adminViewer; // only for displaying buttons and stuff
	const signedIn = data.signedIn;
	const isBetaTester = data.isBetaTester;
</script>

<svelte:head>
	<title>pxl</title>
</svelte:head>

<Header welcome_message={true}></Header>

<div class="page-content">
	<div class="home-actions">
		<br />

		{#if signedIn}
			<a href="/canvas"
				><button class="canvas-button">
					<span class="glitch-layer">Enter the Bitvault</span>
					<span class="glitch-layer">Enter the Bitvault</span>
					<span class="glitch-layer">Enter the Bitvault</span>
					<span class="glitch-layer">Enter the Bitvault</span>
					Enter the Bitvault
				</button></a>
		{:else}
			<button on:click={() => signIn('hackclub', { callbackUrl: '/' })}
				>Sign in with Hackclub</button>
		{/if}

		<button on:click={() => goto('/shop')}>Shop</button>
	</div>

	<div class="para">
		<p>
			pxl is a collaborative art experiment by Hack Club.
			<br /> <br />
			Every minute of hackatime during the month of January allows you to place one pixel on the canvas.
			Double-dipping is allowed for just placing pixels, but if you want merch, you can't double dip and
			need to submit your project to the form in the <a href="/shop">shop</a>.
		</p>
	</div>

	<CanvasHolder editable={false} on_homepage={true}></CanvasHolder>
</div>
