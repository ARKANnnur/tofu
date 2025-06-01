<script>
	import Tofu from '../features/+tofu.svelte';
	import Tagline from '../features/+tagline.svelte';
	import Product from '../features/+product.svelte';
	import ListProducts from '../features/+list-products.svelte';
	import Priceproducts from '../features/+about-us.svelte';
</script>

<svelte:head>
	<title>TOFU</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<!-- <Tofu />
<Tagline />
<Product />
<ListProducts /> -->
<Priceproducts />

<style lang="postcss">
	@reference "tailwindcss";
</style>
