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
					trigger: '.blue',
					start: 'top top',
					end: '+=200%',
					pin: true,
					scrub: true,
					markers: { indent: 500, startColor: 'white', endColor: 'white' }
				}
			})
			.to('.blue', {
				autoAlpha: 1,
				ease: 'none'
			});

		gsap
			.timeline({
				defaults: {
					ease: 'none'
				},
				scrollTrigger: {
					trigger: '.pin-section',
					start: '50% top',
					end: '+=600%',
					scrub: true,
					pin: true,
					markers: { indent: 300, startColor: 'white', endColor: 'white' }
				}
			})
			.to(
				'.pin-title',
				{
					rotation: 360
				},
				'+=0.5'
			)
			.to(
				'.pin-title',
				{
					rotation: -360,
					duration: 1
				},
				'+=0.5'
			)
			.to(
				'.pin-title',
				{
					rotation: 0
				},
				'+=0.5'
			)
			.to({}, {}, '+=0.5');

		gsap
			.timeline({
				scrollTrigger: {
					trigger: '.green',
					start: 'top top',
					end: '+=200%',
					pin: true,
					scrub: true,
					markers: { indent: 500, startColor: 'white', endColor: 'white' }
				}
			})
			.to('.green', {
				autoAlpha: 1,
				ease: 'none'
			})
			.to(
				'.green h1',
				{
					rotation: 360
				},
				'+=0.5'
			)
			.to({}, {});

		ScrollTrigger.refresh();
	});
</script>

<section class="section blue">
  <h1 class="text-center text-dark-50">Hi dajdnjakhdakad</h1>
</section>
<section class="section pin-section flex-col">
	<div class="h-dvh w-full bg-slate-500"></div>
	<div class="flex h-dvh w-full items-center justify-center bg-amber-700">
		<h1 class="pin-title">PIN SECTION</h1>
	</div>
</section>
<section class="section green flex-col">
	<div class="h-dvh w-full bg-slate-500"></div>
	<div class="flex h-dvh w-full items-center justify-center bg-amber-700">
		<h1>PIN SECTION</h1>
	</div>
</section>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Signika+Negative:wght@400;600&display=swap');

	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Signika Negative', sans-serif, Arial;
	}

	h1 {
		font-size: 30px;
	}

	.section {
		width: 100%;
		height: 200dvh;
		background-color: red;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.section.pin-section {
		position: relative;
	}

	.blue {
		background-color: #fff4d2;
		transform: translateY(-200dvh);
		opacity: 0;
		visibility: hidden;
    position: relative;
	}

	.green {
		background-color: green;
		/* margin-top: -600vh; */
		transform: translateY(-400vh);
		opacity: 0;
		visibility: hidden;
	}

	.violet {
		background-color: blueviolet;
	}
</style>
