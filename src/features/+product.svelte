<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		gsap
			.timeline({
				scrollTrigger: {
					trigger: '.product',
					start: 'top top',
					end: '+=200%',
					pin: true,
					scrub: 1.5,
					markers: { indent: 300 }
				}
			})
			.to('.product', {
				autoAlpha: 1,
				ease: 'none'
			})
			.to(
				'.product .text-1',
				{
					x: 30
				},
				'+=0.5'
			)
			.to(
				'.product .text-2',
				{
					x: 160
				},
				'+=0.5'
			)
			.to(
				'.product .text-3',
				{
					x: 120
				},
				'+=0.5'
			)
			.to({}, {});

		ScrollTrigger.refresh();

		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<section class="product max-w-dvw overflow-hidden">
	<h1
		class="text-dark-50 text-1 line-clamp-none text-[15rem] leading-[12rem] font-semibold lg:subpixel-antialiased"
	>
		LIST
	</h1>
	<h1
		class="text-dark-50 text-2 line-clamp-none text-[15rem] leading-[12rem] font-semibold lg:subpixel-antialiased"
	>
		OF ALL
	</h1>
	<h1
		class="text-dark-50 text-3 line-clamp-none text-[15rem] leading-[12rem] font-semibold lg:subpixel-antialiased"
	>
		PRODUCTS
	</h1>
</section>

<style>
	.product {
		width: 100%;
		height: 100dvh;
		background-color: #fff4d2;
		margin-top: -150dvh;
		opacity: 0;
		visibility: hidden;
	}
</style>
