<script>
	import Tagline from '../features/+tagline.svelte';
	import Tofu from '../features/+tofu.svelte';
</script>

<svelte:head>
	<title>TOFU</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<Tofu />
<Tagline />

<style lang="postcss">
	@reference "tailwindcss";
	:global(html) {
		background-color: theme(--color-gray-100);
	}
</style>
