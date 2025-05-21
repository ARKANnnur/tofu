<script>
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	gsap.registerPlugin(ScrollTrigger);

	onMount(() => {
		gsap.to('.box', {
			scale: 20,
			y: -200,
			opacity: 0,
			scrollTrigger: {
				trigger: '.sticky-wrapper',
				start: 'top top',
				end: 'bottom top',
				scrub: 1,
				pin: true
				// markers: true
			}
		});

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<section class="text-dark-50 tagline-tofu h-[300dvh] w-full max-w-dvw bg-black">
	<!-- Bungkus sticky dengan wrapper agar bisa dipin -->
	<div class="sticky-wrapper">
		<div class="sticky top-0">
			<div class="flex h-dvh w-full items-center justify-center overflow-hidden bg-pink-500">
				<div class="box size-24 bg-red-500"></div>
			</div>
		</div>
	</div>

	<!-- Section berikutnya -->
	<section class="h-dvh w-full bg-amber-500"></section>
</section>
