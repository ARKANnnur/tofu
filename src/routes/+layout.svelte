<script>
	import '../app.css';

	let { children } = $props();
</script>

<div class="font-hanken">
	<main>
		{@render children()}
	</main>
</div>
