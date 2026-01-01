<script lang="ts">
	import ShopItem from '$lib/components/ShopItem.svelte';
	import { page } from '$app/stores';
	// import { goto } from '$app/navigation';
	// import { onMount } from 'svelte';
	import '$lib/assets/styles/shop.css';
	import '$lib/assets/styles/home.css';
	import Header from '$lib/components/Header.svelte';

	export let data: { admin_viewer: boolean };
	const user_is_admin = data.admin_viewer; // only for displaying buttons and stuff

	const products = [
		{
			name: 'Retro Pixel Hat',
			price: '??? Hours',
			note: 'Limited Edition',
			image:
				'https://www.shutterstock.com/image-vector/pixelated-cowpoke-hat-red-bandana-260nw-2671680181.jpg'
		},
		{
			name: 'Pixel logo',
			price: '??? Hours',
			note: 'W Art',
			image: '/images/pxl-logo.svg'
		},
		{
			name: '8-bit Shield',
			price: '??? Hours',
			note: 'Defender of Pixels',
			image: 'https://via.placeholder.com/150/00fff9/000000?text=Shield'
		},
		{
			name: 'Pixel T-shirt',
			price: '??? Hours',
			note: 'is that a 67',
			image: 'https://via.placeholder.com/150/2802ff/ffffff?text=TShirt'
		},
		{
			name: 'Pixel Sticker Pack',
			price: '??? Hours',
			note: 'Collect them all!',
			image: 'https://via.placeholder.com/150/1cce75/ffffff?text=Stickers'
		},
		{
			name: 'Pixel Backpack',
			price: '??? Hours',
			note: 'Carry your pixels',
			image: 'https://via.placeholder.com/150/356877/ffffff?text=Backpack'
		},
		{
			name: 'Pixel Mug',
			price: '??? Hours',
			note: 'Perfect for coffee',
			image: 'https://via.placeholder.com/150/115352/ffffff?text=Mug'
		}
	];
</script>

<svelte:head>
	<title>pxl - Shop</title>
</svelte:head>

<Header home_button={true} canvas_button={true}></Header>

<div class="page-content">
	<br />
	<div class="para">
		<h1>Coming Soon!</h1>
		<p>
			The shop will be open soon! Feel free to start working on projects (they can be anything!) to
			get some merch. Prices will be annonced later, and the items will have the final canvas on
			them. You can get more than one item from one project assuming you have enough hours for all
			the items combined.

			<!-- Some of this amazing merch, code a project for the number of hours
			required for the piece of merch you want. You can get more than one item from one project
			assuming you have enough hours for all the items combined. -->
		</p>
	</div>

	<!-- <div class="shop-wrapper">
		{#each products as product}
			<ShopItem
				name={product.name}
				price={product.price}
				note={product.note}
				image={product.image} />
		{/each}
	</div>
	<br />
	<div class="para">
		<p>Like what you see?</p>
		<p>
			To get some of this amazing merch, code a project for the number of hours required for the
			piece of merch you want. You can get more than one item from one project assuming you have
			enough hours for all the items combined.
		</p>

		<p>Project submission form coming soon!</p>
	</div>
	 <a href="https://example.com/fillout"><button>Fillout this Form!</button></a> -->
	<!-- <br /> <br /> -->
</div>
