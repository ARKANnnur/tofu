<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { Shape } from '../utils/shape-build';

	let canvas;

	onMount(async () => {
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			canvas.clientWidth / canvas.clientHeight,
			0.1,
			1000
		);
		scene.background = new THREE.Color(0xfff4d2);
		const renderer = new THREE.WebGLRenderer({
			canvas,
			antialias: true
		});

		renderer.setSize(canvas.clientWidth, canvas.clientHeight);
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		const initialCamPosition = {
			x: 0,
			y: 5,
			z: 5
		};
		camera.position.set(initialCamPosition.x, initialCamPosition.y, initialCamPosition.z);
		camera.lookAt(0, 0, 0);

		// Light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(10, 20, 5);
		light.castShadow = true;
		light.shadow.mapSize.width = 512;
		light.shadow.mapSize.height = 512;
		scene.add(light);

		const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.5);
		scene.add(ambientLight);

		// Create tofu objects with original positions
		let tofuGroupBox = [];
		const tofuGroup = new THREE.Group();

		const tofu = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			color: 0xafa,
			x: 3,
			y: 2,
			z: 0,
			transparent: true,
			opacity: 1
		});

		const tofu1 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			color: 0xaaf,
			x: -5,
			y: 2,
			z: -5,
			rotation: { x: 10, y: 30, z: 10 }
		});

		const tofu2 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			color: 0xfaa,
			x: -5,
			y: 2,
			z: -25,
			rotation: { x: -20, y: -30, z: 10 }
		});

		const tofu3 = new Shape({
			size: { w: 3, h: 2, d: 3 },
			type: 'box',
			color: 0xffa,
			x: 4,
			y: 2,
			z: -10,
			rotation: { x: 0, y: -5, z: -20 }
		});

		// Add to group
		// Fungsi untuk menghasilkan posisi acak dalam rentang kecil
		function getRandomOffset(basePosition, range = 0.5) {
			return {
				x: basePosition.x + (Math.random() - 0.5) * range * 2,
				y: basePosition.y + (Math.random() - 0.5) * range * 2,
				z: basePosition.z + (Math.random() - 0.5) * range * 2
			};
		}

		// Fungsi untuk memulai animasi acak
		function startRandomAnimation(tofuMesh, originalPos) {
			const targetPos = getRandomOffset(originalPos, 0.1); // Rentang ±0.5 unit
			gsap.to(tofuMesh.position, {
				x: targetPos.x,
				y: targetPos.y,
				z: targetPos.z,
				duration: 1.5 + Math.random() * 0.5, // Durasi acak 1.5-2 detik
				ease: 'sine.inOut',
				onComplete: () => {
					// Lanjutkan ke posisi acak berikutnya
					startRandomAnimation(tofuMesh, originalPos);
				}
			});
		}

		// Add to group and start random animations
		tofuGroupBox = [tofu, tofu1, tofu2, tofu3];
		tofuGroupBox.forEach((t) => {
			tofuGroup.add(t.mesh);
			// Mulai animasi acak
			startRandomAnimation(t.mesh, t.mesh.userData.originalPosition);
		});
		scene.add(tofuGroup);

		function animate() {
			requestAnimationFrame(animate);
			camera.updateProjectionMatrix();
			renderer.render(scene, camera);
		}
		animate();

		// Cleanup
		return () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<canvas bind:this={canvas} class="h-full w-full"></canvas>
