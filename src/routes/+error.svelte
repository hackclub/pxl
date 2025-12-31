<script lang="ts">
	import { page } from '$app/stores';
</script>

<!-- Left big skeleton -->
<img
	class="side-skeleton left"
	src="https://gifdb.com/images/high/skeleton-meme-498-x-396-gif-71zngtlvtru9iawl.webp"
	alt="Left Skeleton" />

<!-- Right big skeleton -->
<img
	class="side-skeleton right"
	src="https://gifdb.com/images/high/skeleton-meme-498-x-396-gif-71zngtlvtru9iawl.webp"
	alt="Right Skeleton" />

<div class="error-container">
	<h1>{$page.status}</h1>
	<p>{$page?.error?.message}</p>
	<a href="/">Go to Homepage</a>

	<div class="img-row">
		<img src="https://media1.tenor.com/m/JwoXAYUDx14AAAAd/skeleton.gif" alt="Skeleton 1" />
		<img src="https://media1.tenor.com/m/JwoXAYUDx14AAAAd/skeleton.gif" alt="Skeleton 2" />
	</div>
</div>

<style>
	.error-container {
		display: flex;
		flex-direction: column;
		align-items: center; /* centers everything horizontally */
		padding: 50px;
		text-align: center; /* text centered */
		position: relative;
		z-index: 1; /* keep main content above side skeletons */
	}

	h1 {
		font-size: 4em;
		color: #004c99;
		margin-bottom: 20px;
	}

	p {
		font-size: 1.2em;
		margin-bottom: 20px;
	}

	a {
		margin-bottom: 30px;
		display: inline-block;
	}

	.img-row {
		display: flex;
		justify-content: center;
		gap: 40px;
	}

	.img-row img {
		max-width: 200px;
	}

	.side-skeleton {
		position: fixed;
		top: 50%;
		transform: translateY(-50%);
		max-height: 80vh;
		opacity: 0.7;
		z-index: 0;
		margin: 1rem;
	}

	.side-skeleton.left {
		left: 0;
	}

	.side-skeleton.right {
		right: 0;
	}
</style>
