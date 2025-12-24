<script lang="ts">
	import { signIn, signOut } from '@auth/sveltekit/client';
	import pxlTitle from '$lib/assets/pxl-title.png';
	import '$lib/assets/styles/home.css';
	import { goto } from '$app/navigation';
	export let data: { adminViewer: boolean; signedIn: boolean; isBetaTester: boolean };
	const user_is_admin = data.adminViewer; // only for displaying buttons and stuff
	const signedIn = data.signedIn;
	const isBetaTester = data.isBetaTester;
</script>

<svelte:head>
	<title>Pixel</title>
</svelte:head>

<Header welcome_message={true}></Header>

{#if signedIn && isBetaTester}
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
				<button on:click={() => signIn('hackclub', { callbackUrl: '/home' })}
					>Sign in with Hackclub</button>
			{/if}

			<button on:click={() => goto('/shop')}>Shop</button>
			{#if user_is_admin == true}<AdminButton location="/admin" title="Admin"></AdminButton>{/if}
		</div>
		<CanvasHolder editable={false} on_homepage={true}></CanvasHolder>
	</div>
{:else if !logged_in}<button on:click={() => signIn('hackclub', { callbackUrl: '/' })}
		>Sign in with Hackclub</button>
{:else}<p style="color: red;">Get out non-beta SCUM</p>{/if}
<!-- REMOVE AFTER BETA -->
