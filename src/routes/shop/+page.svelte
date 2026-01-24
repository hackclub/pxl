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
			name: 'pxl Stickers',
			price: '1 hour',
			note: '',
			image:
				'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRELTBI7itggReoTybb7rKjHzzXOv2nlwm24B-WwVz1_VZDuN2H3eTWxE8uhVI7bdp3JSSN7KWAohtBbUwno8OuwQpiQ62K1Y6SzVE7ih9EaRMOAB2mXU75&usqp=CAc'
		},
		{
			name: 'pxl T-Shirt',
			price: '4 hours',
			note: '',
			image:
				'data:image/jpeg;base64,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'
		},
		{
			name: 'pxl Hoodie',
			price: '8 hours',
			note: '',
			image:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfRh0jhw37CLqXkqZR3D_7Z1w1EdkGOWMhDw&s'
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
		<h1>Shop</h1>
		<p>
			Work on projects (they can be anything!) to get some merch. The items will have the final
			canvas on them. You can get more than one item from one project assuming you have enough hours
			for all the items combined.
		</p>
	</div>

	<div class="shop-wrapper">
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

		<a href="https://forms.hackclub.com/pxl" target="_blank"
			><button>Fill out this Form!</button></a>
	</div>
</div>
