<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let canvas;
	let angles = [65, 30, 85, 50];
	let ovalOrder = [0, 1, 2, 3]; // Mengatur urutan lapisan

	onMount(() => {
		const dpr = window.devicePixelRatio || 1;
		canvas.width = 200 * dpr;
		canvas.height = 200 * dpr;
		canvas.style.width = '200px';
		canvas.style.height = '200px';

		const ctx = canvas.getContext('2d');
		ctx.scale(dpr, dpr);
		ctx.imageSmoothingEnabled = true;
		ctx.imageSmoothingQuality = 'high';

		const ovals = [
			{ color: '#FF7878', text: '[ PRODUCT ]' },
			{ color: '#78D6FF', text: '[ VARIANT ]' },
			{ color: '#FFCB78', text: '[ WHY ]' },
			{ color: '#78FF9C', text: '[ TOFU ]' }
		];

		function draw() {
			ctx.fillStyle = "#fff4d2";
			ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

			// Gambar oval sesuai urutan lapisan
			ovalOrder.forEach((index) => {
				const oval = ovals[index];
				ctx.save();
				ctx.translate(30, 10);
				ctx.rotate((angles[index] * Math.PI) / 180);
				ctx.translate(40, 5);
				ctx.beginPath();
				ctx.ellipse(0, 0, 40, 25, 0, 0, 2 * Math.PI);
				ctx.fillStyle = oval.color;
				ctx.fill();
				ctx.fillStyle = '#252525';
				ctx.font = '12px Hanken Grotesk';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(oval.text, 0, 0);
				ctx.restore();
			});
		}

		// Animasi sudut rotasi
    const getRandom = (min, max) => Math.random() * (max - min) + min;

		ovals.forEach((_, index) => {
			gsap.to(angles, {
				[index]: getRandom(5, 90),
				duration: 1.5,
				ease: 'power1.inOut',
				yoyo: true,
				repeat: -1,
				onUpdate: () => {
					angles[index] = Math.max(0, Math.min(90, angles[index]));
					draw();
				}
			});
		});

		// Animasi pergantian lapisan
		function updateLayerOrder() {
			// Geser urutan: oval terakhir jadi pertama
			ovalOrder = [...ovalOrder.slice(1), ovalOrder[0]];
			draw();
		}

		// Jadwalkan pergantian lapisan setiap 2 detik
		const layerTimeline = gsap.to(
			{},
			{
				duration: 2,
				repeat: -1,
				onRepeat: updateLayerOrder
			}
		);

		draw();

		return () => {
			gsap.killTweensOf(angles);
			gsap.killTweensOf(layerTimeline);
		};
	});
</script>

<canvas bind:this={canvas} class="absolute top-0 left-0 z-10 h-full w-full"></canvas>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;700&display=swap');
</style>
