<script>
	import CanvasTester from '../components/+canvas-tester.svelte';
	import FlyLink from '../components/+fly-link.svelte';
</script>

<section class="text-dark-50 relative min-h-[200dvh] max-w-dvw sm:h-dvh">
	<div class="h-dvh w-full lg:w-1/2 absolute z-20 top-0 left-0">
		<div class="h-1/2 p-[10%]">
			<div class="relative z-20 component-tofu-hide size-full"><FlyLink /></div>
		</div>
		<div class="relative h-1/2 lg:pl-[10%]">
			<p class="relative z-20 component-tofu-hide font-semibold">[ TOFU ]</p>
			<h1 class="relative z-20 component-tofu-hide text-[5rem] font-semibold">Taste Tofu</h1>
			<h2 class="font-raleway text-dark-50/90 relative z-20 component-tofu-hide text-xl font-medium">
				Deliciously Sustainable, Perfect for Every Dish
			</h2>
		</div>
	</div>
	<div class="tofu-canvas-trigger position-index relative z-10 h-dvh w-full overflow-hidden">
		<CanvasTester />
	</div>
	<!-- <div class="bg-light-50 relative h-dvh w-full"></div> -->
</section>
