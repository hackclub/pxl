<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import CanvasHolder from '$lib/components/CanvasHolder.svelte';
	import AdminButton from '$lib/components/AdminButton.svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { signIn, signOut } from '@auth/sveltekit/client';
	export let data: { adminViewer: boolean; signedIn: boolean };
	const user_is_admin = data.adminViewer; // only for displaying buttons and stuff
	const signedIn = data.signedIn;
</script>

<svelte:head>
	<title>Pixel - Home</title>
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
		{#if user_is_admin == true}<AdminButton location="/admin" title="Admin"></AdminButton>{/if}
	</div>

	<div class="para">
		<p>
			pxl is a collaborative art experiment by Hack Club.
			<br /> <br />
			Every five minutes of hackatime during the month of January allows you to place one pixel on the
			canvas. Double-dipping is allowed for just placing pixels, but if you want merch, you can't double
			dip and need to submit your project to the form in the <a href="/shop">shop</a>.
		</p>
	</div>

	<CanvasHolder editable={false} on_homepage={true}></CanvasHolder>
</div>
